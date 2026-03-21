import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import {
  CategoryResponseDto,
  CategoryListResponseDto,
  CategorySingleResponseDto,
} from './dto/create-response.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategorySingleResponseDto> {
    const { name, slug, parentId, ...rest } = createCategoryDto;

    if (parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent category with ID "${parentId}" not found`,
        );
      }
    }

    const categorySlug =
      slug ||
      name
        .toLowerCase()
        .trim()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

    const existing = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (existing) throw new ConflictException('Category slug already exists');

    const category = await this.prisma.category.create({
      data: {
        name,
        slug: categorySlug,
        parentId,
        ...rest,
      },
      include: {
        _count: { select: { products: true } },
      },
    });

    return {
      data: {
        ...category,
        productsCount: category._count.products,
      } as unknown as CategoryResponseDto,
    };
  }

  async findAll(query: QueryCategoryDto): Promise<CategoryListResponseDto> {
    const { search, isActive, page = 1, limit = 10, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy || 'createdAt']: sortOrder || 'desc' },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    const mappedCategories = categories.map((cat) => ({
      ...cat,
      productsCount: cat._count.products,
    }));

    return {
      data: mappedCategories as unknown as CategoryResponseDto[],
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findTree(): Promise<CategoryListResponseDto> {
    const tree = await this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        _count: { select: { products: true } },
        children: {
          include: {
            _count: { select: { products: true } },
            children: {
              include: {
                _count: { select: { products: true } },
              },
            },
          },
        },
      },
    });

    // Helper to recursively map productsCount
    const mapTree = (cats: any[]) =>
      cats.map((cat) => ({
        ...cat,
        productsCount: cat._count?.products || 0,
        children: cat.children ? mapTree(cat.children) : [],
      }));

    return {
      data: mapTree(tree) as unknown as CategoryResponseDto[],
      meta: {
        total: tree.length,
        page: 1,
        limit: tree.length,
        totalPages: 1,
      },
    };
  }

  async findOne(id: string): Promise<CategorySingleResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        _count: { select: { products: true } },
      },
    });

    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);

    return {
      data: {
        ...category,
        productsCount: category._count.products,
      } as unknown as CategoryResponseDto,
    };
  }

  async findBySlug(slug: string): Promise<CategorySingleResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        parent: true,
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return {
      data: {
        ...category,
        productsCount: category._count.products,
      } as unknown as CategoryResponseDto,
    };
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategorySingleResponseDto> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    if (updateCategoryDto.parentId === id) {
      throw new BadRequestException('A category cannot be its own parent');
    }

    if (updateCategoryDto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: updateCategoryDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent category "${updateCategoryDto.parentId}" not found`,
        );
      }
    }

    if (updateCategoryDto.slug) {
      const existing = await this.prisma.category.findFirst({
        where: {
          slug: updateCategoryDto.slug,
          id: { not: id },
        },
      });
      if (existing) throw new ConflictException('Slug already in use');
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        _count: { select: { products: true } },
      },
    });

    return {
      data: {
        ...updated,
        productsCount: updated._count.products,
      } as unknown as CategoryResponseDto,
    };
  }

  async remove(id: string): Promise<void> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    await this.prisma.category.delete({ where: { id } });
  }
}
