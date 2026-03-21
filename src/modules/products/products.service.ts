import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto, SortOrder } from './dto/query-product.dto';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';
import {
  ProductSingleResponseDto,
  ProductListResponseDto,
} from './dto/product-response.dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private getCacheKey(query: QueryProductDto): string {
    return `products_list:${JSON.stringify(query)}`;
  }

  async clearProductCache(id?: string, slug?: string) {
    try {
      // 1. Clear individual detail keys
      if (id) await this.cacheManager.del(`product_detail:id:${id}`);
      if (slug) await this.cacheManager.del(`product_detail:slug:${slug}`);
      await this.cacheManager.del('homepage_sections');

      // 2. Clear all list queries
      const store = this.cacheManager as any;

      if (store.store && typeof store.store.keys === 'function') {
        const keys: string[] = await store.store.keys('products_list:*');
        await Promise.all(keys.map((key) => this.cacheManager.del(key)));
      } else if (typeof store.reset === 'function') {
        await store.reset();
      } else if (typeof store.clear === 'function') {
        await store.clear();
      }

      console.log('Cache invalidated successfully');
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  async create(dto: CreateProductDto): Promise<ProductSingleResponseDto> {
    const { images, imageUrl, ...data } = dto;
    let slug = dto.slug || this.generateSlug(data.name);

    const existing = await this.prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const product = await this.prisma.product.create({
      data: {
        ...data,
        slug,
        // Set primary image to provided imageUrl or fallback to first item in images array
        imageUrl: imageUrl || (images && images.length > 0 ? images[0] : null),
        images:
          images && images.length > 0
            ? { create: images.map((url) => ({ url })) }
            : undefined,
      },
      include: { images: true },
    });

    await this.clearProductCache();
    return { data: product as any };
  }

  async findAll(query: QueryProductDto): Promise<ProductListResponseDto> {
    const cacheKey = this.getCacheKey(query);
    const cachedData =
      await this.cacheManager.get<ProductListResponseDto>(cacheKey);

    if (cachedData) return cachedData;

    const {
      search,
      categoryId,
      isActive,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isFlashDeal,
      activeDealsOnly,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
      page = 1,
      limit = 10,
    } = query;

    const skip = (Number(page) - 1) * Number(limit);
    const andFilters: any[] = [];

    if (search) {
      andFilters.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (categoryId) andFilters.push({ categoryId });
    if (isActive !== undefined)
      andFilters.push({ isActive: isActive === 'true' });
    if (isFeatured !== undefined)
      andFilters.push({ isFeatured: isFeatured === 'true' });
    if (isBestSeller !== undefined)
      andFilters.push({ isBestSeller: isBestSeller === 'true' });
    if (isNewArrival !== undefined)
      andFilters.push({ isNewArrival: isNewArrival === 'true' });
    if (isFlashDeal !== undefined)
      andFilters.push({ isFlashDeal: isFlashDeal === 'true' });

    if (activeDealsOnly === 'true') {
      andFilters.push({ isFlashDeal: true, flashDealEnd: { gte: new Date() } });
    }

    andFilters.push({
      price: {
        gte: Number(minPrice) || 0,
        ...(maxPrice ? { lte: Number(maxPrice) } : {}),
      },
    });

    const where = { AND: andFilters };
    const sortFieldMap: Record<string, string> = {
      featured: 'isFeatured',
      newest: 'createdAt',
      price: 'price',
      'price-low': 'price',
      'price-high': 'price',
    };

    const finalSortBy = sortFieldMap[sortBy] || sortBy;
    const finalSortOrder = sortBy === 'price-low' ? SortOrder.ASC : sortOrder;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        include: { images: true, category: true },
        orderBy: { [finalSortBy]: finalSortOrder },
      }),
      this.prisma.product.count({ where }),
    ]);

    const result = {
      data: products as any,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };

    await this.cacheManager.set(cacheKey, result, 600000);
    return result;
  }

  async findOne(id: string): Promise<ProductSingleResponseDto> {
    const cacheKey = `product_detail:id:${id}`;
    const cached =
      await this.cacheManager.get<ProductSingleResponseDto>(cacheKey);
    if (cached) return cached;

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true },
    });

    if (!product) throw new NotFoundException('Product not found');
    const result = { data: product as any };
    await this.cacheManager.set(cacheKey, result, 3600000);
    return result;
  }

  async findByCategory(categorySlug: string) {
    return this.prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
        isActive: true,
      },
      include: {
        images: true,
        category: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<ProductSingleResponseDto> {
    const cacheKey = `product_detail:slug:${slug}`;
    const cached =
      await this.cacheManager.get<ProductSingleResponseDto>(cacheKey);
    if (cached) return cached;

    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { images: true, category: true },
    });

    if (!product) throw new NotFoundException('Product not found');
    const result = { data: product as any };
    await this.cacheManager.set(cacheKey, result, 3600000);
    return result;
  }

  async update(
    id: string,
    dto: UpdateProductDto,
  ): Promise<ProductSingleResponseDto> {
    const { images, imageUrl, ...data } = dto;
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    const updateData: any = { ...data };

    // Explicitly update primary image if provided
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    if (images) {
      // Clear existing relational images and replace with new ones
      await this.prisma.image.deleteMany({ where: { productId: id } });
      updateData.images = { create: images.map((url) => ({ url })) };

      // Auto-update primary image if it wasn't explicitly provided in the payload
      if (!imageUrl && images.length > 0) {
        updateData.imageUrl = images[0];
      }
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: { images: true },
    });

    await this.clearProductCache(id, existing.slug);
    return { data: updated as any };
  }

  async updateStock(
    id: string,
    dto: UpdateProductStockDto,
  ): Promise<ProductSingleResponseDto> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    const updated = await this.prisma.product.update({
      where: { id },
      data: { stock: dto.stock },
      include: { images: true },
    });

    await this.clearProductCache(id, product.slug);
    return { data: updated as any };
  }

  async remove(id: string): Promise<{ message: string }> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { _count: { select: { orderItems: true } } },
    });

    if (!product) throw new NotFoundException('Product not found');

    let message = 'Product permanently deleted';
    try {
      if (product._count.orderItems > 0) throw { code: 'P2003' };
      await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2003') {
        await this.prisma.product.update({
          where: { id },
          data: { isActive: false },
        });
        message = 'Product deactivated due to existing order history';
      } else {
        throw error;
      }
    }

    await this.clearProductCache(id, product.slug);
    return { message };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
