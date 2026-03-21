import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MetaDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

export class CategoryResponseDto {
  @ApiProperty({ example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' })
  id: string;

  @ApiProperty({ example: 'Electronics' })
  name: string;

  @ApiProperty({ example: 'electronics' })
  slug: string;

  @ApiPropertyOptional({
    example: 'High-end gadgets and consumer electronics',
    description: 'The description of the category',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/electronics.jpg',
  })
  imageUrl?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiPropertyOptional({ example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' })
  parentId?: string;

  @ApiProperty({ example: '2026-02-13T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-13T12:00:00.000Z' })
  updatedAt: Date;
}

export class CategoryListResponseDto {
  @ApiProperty({ type: [CategoryResponseDto] })
  data: CategoryResponseDto[];

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}

export class CategorySingleResponseDto {
  @ApiProperty({ type: CategoryResponseDto })
  data: CategoryResponseDto;
}
