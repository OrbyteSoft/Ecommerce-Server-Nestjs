import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus, OrderStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  private generateReference(method: PaymentMethod): string {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `TXN_${method}_${randomNum}`;
  }

  private determineOrderStatus(
    method: PaymentMethod,
    status: PaymentStatus,
  ): OrderStatus | null {
    if (status !== PaymentStatus.SUCCESS) return null;

    if (method === PaymentMethod.COD) {
      return OrderStatus.DELIVERED;
    }
    return OrderStatus.PAID;
  }

  async createPayment(userId: string, dto: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId)
      throw new BadRequestException('Unauthorized order access');

    const finalReference = dto.reference || this.generateReference(dto.method);

    const paymentStatus =
      dto.method === PaymentMethod.COD
        ? PaymentStatus.PENDING
        : PaymentStatus.SUCCESS;

    return await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.upsert({
        where: { orderId: dto.orderId },
        update: {
          method: dto.method,
          amount: dto.amount,
          reference: finalReference,
          status: paymentStatus,
        },
        create: {
          orderId: dto.orderId,
          userId: userId,
          method: dto.method,
          amount: dto.amount,
          reference: finalReference,
          status: paymentStatus,
        },
      });

      const newOrderStatus = this.determineOrderStatus(
        dto.method,
        payment.status,
      );
      if (newOrderStatus) {
        await tx.order.update({
          where: { id: dto.orderId },
          data: { status: newOrderStatus },
        });
      }

      return payment;
    });
  }

  async verifyPayment(
    paymentId: string,
    reference: string,
    status: PaymentStatus,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const existingPayment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { order: true },
      });

      if (!existingPayment)
        throw new NotFoundException('Payment record not found');

      const finalReference =
        reference || this.generateReference(existingPayment.method);

      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: { reference: finalReference, status },
      });

      const newOrderStatus = this.determineOrderStatus(
        existingPayment.method,
        status,
      );
      if (newOrderStatus) {
        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: newOrderStatus },
        });
      }

      return payment;
    });
  }

  async findUserPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      include: { order: { select: { orderNumber: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllPayments() {
    return this.prisma.payment.findMany({
      include: {
        order: {
          select: {
            orderNumber: true,
            status: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
