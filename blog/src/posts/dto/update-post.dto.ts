import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({
    example: 'Updated post title',
    description: 'Optional new title for the post.',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated article content.',
    description: 'Optional new content for the post.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;
}
