import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'My first NestJS blog post',
    description: 'Public title shown in the blog listing and details page.',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiProperty({
    example:
      'This post explains how I built a blog API with NestJS, JWT, and PostgreSQL.',
    description: 'Main post body content.',
  })
  @IsString()
  @IsNotEmpty()
  content!: string;
}
