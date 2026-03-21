import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // CORS Configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8081',
      'http://localhost:8082',
      'https://justclickeco.vercel.app',
      ...(process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : []),
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Accept,Authorization,X-Requested-With',
  });

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('E-commerce Backend API')
    .setDescription(
      'Complete API Documentation for Auth, Users, Addresses, Categories, Products, Images, Cart, Orders, Wishlist, Reviews, Coupons, and Payments.',
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentication and Authorization')
    .addTag('users', 'User profile and account management')
    .addTag('addresses', 'Shipping and Billing address management')
    .addTag('categories', 'Product categorization and hierarchy')
    .addTag('products', 'Product catalog and inventory')
    .addTag('images', 'Product gallery and media management')
    .addTag('cart', 'Shopping cart and item management')
    .addTag('orders', 'Order placement, tracking, and history')
    .addTag('wishlist', 'Personalized user save-for-later items')
    .addTag('reviews', 'Product ratings and customer feedback')
    .addTag('coupons', 'Discount codes and promotional offers')
    .addTag('payments', 'Transaction processing and payment status')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Refresh-JWT',
        in: 'header',
      },
      'JWT-refresh',
    )
    .addServer(
      process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagSorter: 'alpha',
      operationSorter: 'alpha',
      docExpansion: 'none',
    },
    customSiteTitle: 'E-commerce API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { background-color: #000000; border-bottom: 2px solid #e0234e; }
      .swagger-ui .info .title { color: #e0234e; }
      .topbar-wrapper img { content:url('https://nestjs.com/img/logo-small.svg'); width:40px; }
    `,
  });

  const port = process.env.PORT ?? 3000;

  // Cleanup database connections on shutdown
  app.enableShutdownHooks();

  await app.listen(port);

  logger.log(`🚀 Server running on: http://localhost:${port}/api/v1`);
  logger.log(`📄 Documentation: http://localhost:${port}/api/docs`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Main');
  logger.error('Error starting server', error);
  process.exit(1);
});
