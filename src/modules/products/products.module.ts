import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisCacheModule } from 'src/common/radis/redis-cache.module';

@Module({
  imports: [PrismaModule, RedisCacheModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
