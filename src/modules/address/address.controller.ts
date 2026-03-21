import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { AddressResponseDto } from './dto/address-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorators';

@ApiTags('addresses')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: '[USER] Add a new address' })
  @ApiResponse({ status: 201, type: AddressResponseDto })
  async create(@GetUser('id') userId: string, @Body() dto: CreateAddressDto) {
    return this.addressService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '[USER] Get all my addresses' })
  @ApiResponse({ status: 200, type: [AddressResponseDto] })
  async findAll(@GetUser('id') userId: string) {
    return this.addressService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '[USER] Get specific address details' })
  @ApiResponse({ status: 200, type: AddressResponseDto })
  async findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.addressService.findOne(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[USER] Delete an address' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.addressService.remove(id, userId);
  }
}
