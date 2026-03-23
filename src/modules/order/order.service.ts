import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async findAllAdmin() {
    const orders = await this.prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        shippingAddr: true,
        billingAddr: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o) => this.mapOrderToResponse(o));
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: { include: { product: true } },
        shippingAddr: true,
        billingAddr: true,
      },
    });
    return this.mapOrderToResponse(updated);
  }

  async create(userId: string, dto: CreateOrderDto) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    let subtotal = 0;
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for: ${item.product.name}`,
        );
      }
      subtotal += item.product.price * item.quantity;
    }

    const tax = 0;
    const shippingFee = subtotal > 1000 ? 0 : 50;
    const total = subtotal + shippingFee;

    return await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${Math.floor(
            1000 + Math.random() * 9000,
          )}`,
          userId,
          status: 'PENDING',
          paymentMethod: dto.paymentMethod,
          phone: dto.phone,
          notes: dto.notes,
          subtotal,
          tax,
          shippingFee,
          total,
          shippingAddrId: dto.shippingAddrId,
          billingAddrId: dto.billingAddrId,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
          payment: {
            create: {
              userId,
              method: dto.paymentMethod,
              amount: total,
              status: 'PENDING',
              reference: dto.transactionId || null,
            },
          },
        },
        include: {
          items: { include: { product: true } },
          shippingAddr: true,
          billingAddr: true,
        },
      });

      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { userId } });

      return this.mapOrderToResponse(order);
    });
  }

  async findAll(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        shippingAddr: true,
        billingAddr: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((o) => this.mapOrderToResponse(o));
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: { include: { product: true } },
        shippingAddr: true,
        billingAddr: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    return this.mapOrderToResponse(order);
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: { include: { product: true } },
        shippingAddr: true,
        billingAddr: true,
      },
    });

    if (!order) throw new NotFoundException(`Order #${orderNumber} not found.`);

    return this.mapOrderToResponse(order);
  }

  private mapOrderToResponse(order: any) {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentMethod: order.paymentMethod,
      phone: order.phone,
      notes: order.notes,
      subtotal: order.subtotal,
      tax: order.tax,
      shippingFee: order.shippingFee,
      total: order.total,
      createdAt: order.createdAt,
      customer: order.user
        ? { name: order.user.name, email: order.user.email }
        : undefined,

      shippingAddress: order.shippingAddr && {
        id: order.shippingAddr.id,
        line1: order.shippingAddr.line1,
        line2: order.shippingAddr.line2,
        city: order.shippingAddr.city,
        state: order.shippingAddr.state,
        country: order.shippingAddr.country,
        zipCode: order.shippingAddr.zipCode,
      },

      billingAddress: order.billingAddr && {
        id: order.billingAddr.id,
        line1: order.billingAddr.line1,
        line2: order.billingAddr.line2,
        city: order.billingAddr.city,
        state: order.billingAddr.state,
        country: order.billingAddr.country,
        zipCode: order.billingAddr.zipCode,
      },

      items: order.items.map((item: any) => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }
}
