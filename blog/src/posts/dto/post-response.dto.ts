import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty({
    example: '8d4a4455-6108-4337-897a-d95f4a2d6320',
    description: 'Unique identifier of the post.',
  })
  id!: string;

  @ApiProperty({
    example: 'My first NestJS blog post',
    description: 'Public title of the blog post.',
  })
  title!: string;

  @ApiProperty({
    example:
      'This post explains how I built a blog API with NestJS, JWT, and PostgreSQL.',
    description: 'Main content of the blog post.',
  })
  content!: string;

  @ApiProperty({
    example: '2026-04-10T10:20:30.000Z',
    description: 'Timestamp when the post was created.',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-04-10T10:20:30.000Z',
    description: 'Timestamp when the post was last updated.',
  })
  updatedAt!: Date;
}
