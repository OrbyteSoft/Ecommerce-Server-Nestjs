import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import {
  CategoryListResponseDto,
  CategorySingleResponseDto,
} from './dto/create-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // --- ADMIN ONLY OPERATIONS ---

  @Post()
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: '[ADMIN] Create a new category' })
  @ApiResponse({ status: 201, type: CategorySingleResponseDto })
  async adminCreateCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategorySingleResponseDto> {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: '[ADMIN] Update category details' })
  @ApiResponse({ status: 200, type: CategorySingleResponseDto })
  async adminUpdateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategorySingleResponseDto> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: '[ADMIN] Delete category' })
  @ApiResponse({ status: 204, description: 'Category successfully deleted' })
  async adminRemoveCategory(@Param('id') id: string): Promise<void> {
    await this.categoryService.remove(id);
  }

  // --- PUBLIC OPERATIONS ---

  @Get()
  @ApiOperation({ summary: '[PUBLIC] Get all categories with pagination' })
  @ApiResponse({ status: 200, type: CategoryListResponseDto })
  async publicFindAll(
    @Query() query: QueryCategoryDto,
  ): Promise<CategoryListResponseDto> {
    return this.categoryService.findAll(query);
  }

  @Get('tree')
  @ApiOperation({ summary: '[PUBLIC] Get hierarchical category tree' })
  @ApiResponse({ status: 200, type: CategoryListResponseDto })
  async publicFindTree(): Promise<CategoryListResponseDto> {
    return this.categoryService.findTree();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: '[PUBLIC] Get category by slug' })
  @ApiResponse({ status: 200, type: CategorySingleResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async publicFindBySlug(
    @Param('slug') slug: string,
  ): Promise<CategorySingleResponseDto> {
    return this.categoryService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: '[PUBLIC] Get single category by ID' })
  @ApiResponse({ status: 200, type: CategorySingleResponseDto })
  async publicFindOne(
    @Param('id') id: string,
  ): Promise<CategorySingleResponseDto> {
    return this.categoryService.findOne(id);
  }
}
