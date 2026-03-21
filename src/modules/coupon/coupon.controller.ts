import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CouponResponseDto } from './dto/coupon-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('coupons')
@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[ADMIN] Create a new coupon' })
  @ApiResponse({ status: 201, type: CouponResponseDto })
  async create(@Body() dto: CreateCouponDto) {
    return this.couponService.create(dto);
  }

  @Get('validate')
  @ApiOperation({ summary: '[PUBLIC] Validate a coupon code' })
  @ApiResponse({ status: 200, type: CouponResponseDto })
  async validate(@Query('code') code: string) {
    return this.couponService.validateCoupon(code);
  }

  @Get()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[ADMIN] List all coupons' })
  @ApiResponse({ status: 200, type: [CouponResponseDto] })
  async findAll() {
    return this.couponService.findAll();
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[ADMIN] Delete a coupon' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}
