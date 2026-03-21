import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: string, dto: AddToCartDto) {
    const { productId, quantity } = dto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Product not found');
    if (!product.isActive)
      throw new BadRequestException('Product is currently unavailable');

    // Find existing item to check cumulative stock
    const existingItem = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    const totalRequestedQuantity = (existingItem?.quantity || 0) + quantity;
    if (product.stock < totalRequestedQuantity) {
      throw new BadRequestException(
        `Cannot add ${quantity} more units. Total in cart would exceed stock (${product.stock} available).`,
      );
    }

    return this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId, productId, quantity },
    });
  }

  async getMyCart(userId: string): Promise<CartResponseDto> {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stock: true,
            images: { take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const subtotal = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );

    return {
      items: items as any,
      subtotal,
      itemCount: items.length,
    };
  }

  async updateQuantity(
    userId: string,
    productId: string,
    dto: UpdateCartQuantityDto,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Product not found');
    if (product.stock < dto.quantity) {
      throw new BadRequestException(
        `Only ${product.stock} units available in stock`,
      );
    }

    return this.prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity: dto.quantity },
    });
  }

  async removeItem(userId: string, productId: string) {
    try {
      return await this.prisma.cartItem.delete({
        where: { userId_productId: { userId, productId } },
      });
    } catch (error) {
      throw new NotFoundException('Item not found in cart');
    }
  }

  async clearCart(userId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { userId },
    });
  }
}
