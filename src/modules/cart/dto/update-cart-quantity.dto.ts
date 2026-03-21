import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateCartQuantityDto {
  @ApiProperty({ example: 3, description: 'The absolute new quantity' })
  @IsInt()
  @Min(1)
  quantity: number;
}
