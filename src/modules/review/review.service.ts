import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const existingReview = await this.prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId: dto.productId },
      },
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this product');
    }

    const hasBought = await this.prisma.order.findFirst({
      where: {
        userId,
        status: 'DELIVERED',
        items: { some: { productId: dto.productId } },
      },
    });

    if (!hasBought) {
      throw new ForbiddenException(
        'You can only review products you have purchased and received',
      );
    }

    return this.prisma.review.create({
      data: {
        userId,
        productId: dto.productId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: { select: { name: true } },
      },
    });
  }

  async findByProduct(productId: string) {
    const [reviews, stats] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId },
        include: {
          user: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    return {
      averageRating: Number(stats._avg.rating?.toFixed(1)) || 0,
      totalReviews: stats._count.rating,
      reviews: reviews as any,
    };
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });

    if (!review) throw new NotFoundException('Review not found');

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    return this.prisma.review.delete({ where: { id } });
  }
}
