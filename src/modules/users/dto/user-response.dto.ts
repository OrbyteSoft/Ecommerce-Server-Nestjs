import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'The unique identifier of the user',
  })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'The full name of the user',
    nullable: true,
  })
  name: string | null;

  @ApiProperty({
    enum: Role,
    example: Role.USER,
    description: 'The role assigned to the user',
  })
  role: Role;

  @ApiProperty({
    example: '2026-02-12T11:00:00.000Z',
    description: 'Timestamp when the user account was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-02-12T12:00:00.000Z',
    description: 'Timestamp when the user account was last updated',
  })
  updatedAt: Date;
}
