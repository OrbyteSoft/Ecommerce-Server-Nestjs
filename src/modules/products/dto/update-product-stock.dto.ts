import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateProductStockDto {
  @ApiProperty({
    example: 100,
    description: 'The new total stock quantity for the product',
  })
  @IsNumber()
  @Min(0)
  stock: number;
}
