import {
  Controller,
  Get,
  Param,
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
import { ImageService } from './image.service';
import { ImageResponseDto } from './dto/image-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('images')
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('product/:productId')
  @ApiOperation({ summary: '[PUBLIC] Get images for a product' })
  @ApiResponse({ status: 200, type: [ImageResponseDto] })
  async findByProduct(@Param('productId') productId: string) {
    return this.imageService.findByProduct(productId);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(204)
  @ApiOperation({ summary: '[ADMIN] Delete a product image' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string) {
    return this.imageService.remove(id);
  }
}
