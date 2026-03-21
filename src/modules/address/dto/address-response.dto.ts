import { ApiProperty } from '@nestjs/swagger';

export class AddressResponseDto {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'Unique identifier of the address',
  })
  id: string;

  @ApiProperty({
    example: '123 New Road',
    description: 'Street address or P.O. box',
  })
  line1: string;

  @ApiProperty({
    example: 'Building 4, Suite 101',
    nullable: true,
    description: 'Apartment, unit, floor, etc.',
  })
  line2: string | null;

  @ApiProperty({
    example: 'Kathmandu',
    description: 'City name',
  })
  city: string;

  @ApiProperty({
    example: 'Bagmati',
    nullable: true,
    description: 'State, province, or region',
  })
  state: string | null;

  @ApiProperty({
    example: 'Nepal',
    description: 'Full country name',
  })
  country: string;

  @ApiProperty({
    example: '44600',
    description: 'Postal or ZIP code',
  })
  zipCode: string;
}
