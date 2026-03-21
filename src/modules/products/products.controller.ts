import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';
import { ProductListResponseDto } from './dto/product-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('homepage')
  @ApiOperation({ summary: '[PUBLIC] Get curated products for homepage' })
  async getHomepageSections() {
    const cacheKey = 'homepage_sections';
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) return cachedData;

    const [featured, flash, best, arrivals] = await Promise.all([
      this.productService.findAll({
        isFeatured: 'true',
        limit: 8,
        isActive: 'true',
      }),
      this.productService.findAll({
        isFlashDeal: 'true',
        activeDealsOnly: 'true',
        limit: 4,
        isActive: 'true',
      }),
      this.productService.findAll({
        isBestSeller: 'true',
        limit: 8,
        isActive: 'true',
      }),
      this.productService.findAll({
        isNewArrival: 'true',
        limit: 8,
        isActive: 'true',
      }),
    ]);

    const result = {
      featured: featured.data,
      flashDeals: flash.data,
      bestSellers: best.data,
      newArrivals: arrivals.data,
    };

    await this.cacheManager.set(cacheKey, result, 1800000);
    return result;
  }

  @Get()
  publicFindAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  @Get('slug/:slug')
  publicFindBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Get(':id')
  publicFindOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  adminCreateProduct(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  adminUpdateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Patch(':id/stock')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  adminUpdateStock(
    @Param('id') id: string,
    @Body() dto: UpdateProductStockDto,
  ) {
    return this.productService.updateStock(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  adminDeleteProduct(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
