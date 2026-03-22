import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/products/products.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { ReviewModule } from './modules/review/review.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { AddressModule } from './modules/address/address.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ImageModule } from './modules/image/image.module';
import { BrandModule } from './modules/brand/brand.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoryModule,
    ProductModule,
    WishlistModule,
    CartModule,
    OrderModule,
    ReviewModule,
    CouponModule,
    AddressModule,
    PaymentModule,
    ImageModule,
    BrandModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
