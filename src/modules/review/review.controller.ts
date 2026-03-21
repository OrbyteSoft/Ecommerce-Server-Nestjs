import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import {
  ProductReviewStatsDto,
  ReviewItemDto,
} from './dto/review-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { Role } from '@prisma/client';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] View all reviews across the entire platform',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all reviews with user and product details',
  })
  async findAll() {
    return this.reviewService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[USER] Post a product review' })
  @ApiResponse({
    status: 201,
    type: ReviewItemDto,
  })
  async create(
    @GetUser('id') userId: string,
    @Body() dto: CreateReviewDto,
  ): Promise<ReviewItemDto> {
    return this.reviewService.create(userId, dto) as any;
  }

  @Get('product/:productId')
  @ApiOperation({ summary: '[PUBLIC] Get all reviews for a product' })
  @ApiResponse({
    status: 200,
    type: ProductReviewStatsDto,
  })
  async findByProduct(
    @Param('productId') productId: string,
  ): Promise<ProductReviewStatsDto> {
    return this.reviewService.findByProduct(productId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[USER] Delete my review' })
  @ApiResponse({ status: 204 })
  async remove(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ): Promise<void> {
    await this.reviewService.remove(id, userId);
  }
}
