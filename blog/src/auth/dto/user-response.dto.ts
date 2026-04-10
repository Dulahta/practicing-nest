import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '4269dc0b-abcf-4d78-aed2-a0fcde41b71f',
    description: 'Unique identifier of the user.',
  })
  id!: string;

  @ApiProperty({
    example: 'john_dev',
    description: 'Public username of the user.',
  })
  username!: string;

  @ApiProperty({
    example: '2026-04-10T10:20:30.000Z',
    description: 'Timestamp when the user account was created.',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-04-10T10:20:30.000Z',
    description: 'Timestamp when the user record was last updated.',
  })
  updatedAt!: Date;
}
