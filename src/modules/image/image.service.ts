import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: string) {
    return this.prisma.image.findMany({
      where: { productId },
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.image.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Image not found');
    }
  }
}
