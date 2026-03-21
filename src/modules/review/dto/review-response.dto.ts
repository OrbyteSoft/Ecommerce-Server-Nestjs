import { ApiProperty } from '@nestjs/swagger';

class UserReviewerDto {
  @ApiProperty({ example: 'John Doe', nullable: true })
  name: string | null;
}

export class ReviewItemDto {
  @ApiProperty({ example: 'b3a123e4-5678-90ab-cdef-1234567890ab' })
  id: string;

  @ApiProperty({ example: 5 })
  rating: number;

  @ApiProperty({ example: 'Amazing quality!', nullable: true })
  comment: string | null;

  @ApiProperty({ example: '2026-02-13T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: UserReviewerDto })
  user: UserReviewerDto;
}

export class ProductReviewStatsDto {
  @ApiProperty({ example: 4.5 })
  averageRating: number;

  @ApiProperty({ example: 120 })
  totalReviews: number;

  @ApiProperty({ type: [ReviewItemDto] })
  reviews: ReviewItemDto[];
}
