import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { PaymentStatus, Role } from '@prisma/client';

@ApiTags('payments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all payments for admin' })
  @ApiResponse({ status: 200, description: 'List of all payments' })
  async findAll() {
    return this.paymentService.findAllPayments();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initiate/Record a payment' })
  @ApiResponse({ status: 201, type: PaymentResponseDto })
  async create(@GetUser('id') userId: string, @Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(userId, dto);
  }

  @Get('my-history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user payment history' })
  @ApiResponse({ status: 200, type: [PaymentResponseDto] })
  async findMyPayments(@GetUser('id') userId: string) {
    return this.paymentService.findUserPayments(userId);
  }

  @Patch(':id/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update payment status (Webhook simulation)' })
  @ApiResponse({ status: 200, type: PaymentResponseDto })
  async verify(
    @Param('id') id: string,
    @Body('reference') reference: string,
    @Body('status') status: PaymentStatus,
  ) {
    return this.paymentService.verifyPayment(id, reference, status);
  }
}
