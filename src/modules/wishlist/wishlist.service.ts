import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async toggleWishlist(userId: string, dto: AddToWishlistDto) {
    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId: dto.productId },
      },
    });

    if (existing) {
      // If it exists, we remove it (Toggle behavior)
      await this.prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      return { message: 'Product removed from wishlist', added: false };
    }

    // Check if product exists before adding
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    await this.prisma.wishlistItem.create({
      data: { userId, productId: dto.productId },
    });

    return { message: 'Product added to wishlist', added: true };
  }

  async getMyWishlist(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { take: 1 }, // Just get the main image
            category: { select: { name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { data: items };
  }

  async clearWishlist(userId: string) {
    await this.prisma.wishlistItem.deleteMany({
      where: { userId },
    });
    return { message: 'Wishlist cleared successfully' };
  }
}
