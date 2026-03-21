import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorators';

@ApiTags('cart')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: '[USER] Add a product to the cart' })
  @ApiResponse({
    status: 201,
    description: 'Product added to cart successfully',
  })
  async addToCart(@GetUser('id') userId: string, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '[USER] Get current user cart' })
  @ApiResponse({
    status: 200,
    type: CartResponseDto,
    description: 'Returns all items in the cart with calculated subtotal',
  })
  async getMyCart(@GetUser('id') userId: string): Promise<CartResponseDto> {
    return this.cartService.getMyCart(userId);
  }

  @Patch(':productId')
  @ApiOperation({ summary: '[USER] Update item quantity in cart' })
  @ApiResponse({
    status: 200,
    description: 'Cart quantity updated successfully',
  })
  async updateQuantity(
    @GetUser('id') userId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartQuantityDto,
  ) {
    return this.cartService.updateQuantity(userId, productId, dto);
  }

  @Delete(':productId')
  @HttpCode(204)
  @ApiOperation({ summary: '[USER] Remove a specific item from cart' })
  @ApiResponse({ status: 204, description: 'Item removed from cart' })
  async removeItem(
    @GetUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    await this.cartService.removeItem(userId, productId);
  }

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: '[USER] Clear the entire cart' })
  @ApiResponse({ status: 204, description: 'Cart cleared successfully' })
  async clearCart(@GetUser('id') userId: string) {
    await this.cartService.clearCart(userId);
  }
}
