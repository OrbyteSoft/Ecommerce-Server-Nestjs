import { ApiProperty } from '@nestjs/swagger';

export class CouponResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  discount: number;
  @ApiProperty()
  active: boolean;
  @ApiProperty({ nullable: true })
  expiresAt: Date | null;
}
