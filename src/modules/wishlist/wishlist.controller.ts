import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorators';

@ApiTags('wishlist')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('toggle')
  @HttpCode(200)
  @ApiOperation({ summary: '[USER] Add or Remove product from wishlist' })
  @ApiResponse({ status: 200, description: 'Toggled successfully' })
  toggle(@GetUser('id') userId: string, @Body() dto: AddToWishlistDto) {
    return this.wishlistService.toggleWishlist(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '[USER] Get my wishlist items' })
  findAll(@GetUser('id') userId: string) {
    return this.wishlistService.getMyWishlist(userId);
  }

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: '[USER] Clear entire wishlist' })
  clear(@GetUser('id') userId: string) {
    return this.wishlistService.clearWishlist(userId);
  }
}
