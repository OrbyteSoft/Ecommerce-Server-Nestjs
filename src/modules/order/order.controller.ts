import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderSingleResponseDto } from './dto/order-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { Role, OrderStatus } from '@prisma/client';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('admin/all')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[ADMIN] Fetch all orders in the system' })
  @ApiResponse({ status: 200, type: [OrderSingleResponseDto] })
  async findAllAdmin() {
    return this.orderService.findAllAdmin();
  }

  @Patch('admin/:id/status')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[ADMIN] Update the status of any order' })
  @ApiResponse({ status: 200, type: OrderSingleResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.updateStatus(id, status);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[USER] Checkout and create order' })
  @ApiResponse({ status: 201, type: OrderSingleResponseDto })
  async create(@GetUser('id') userId: string, @Body() dto: CreateOrderDto) {
    return this.orderService.create(userId, dto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[USER] Get all my orders' })
  @ApiResponse({ status: 200, type: [OrderSingleResponseDto] })
  async findAll(@GetUser('id') userId: string) {
    return this.orderService.findAll(userId);
  }

  @Get('number/:orderNumber')
  @ApiOperation({
    summary: '[PUBLIC] Track order via Order Number (Protocol ID)',
  })
  @ApiResponse({ status: 200, type: OrderSingleResponseDto })
  async findByNumber(@Param('orderNumber') orderNumber: string) {
    return this.orderService.findByOrderNumber(orderNumber);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[USER] Get specific order details by UUID' })
  @ApiResponse({ status: 200, type: OrderSingleResponseDto })
  async findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.orderService.findOne(id, userId);
  }
}
