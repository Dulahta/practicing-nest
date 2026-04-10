import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({
    example: 'john_dev',
    description:
      'Unique username used to register and log in. Letters, numbers, dots, underscores, and hyphens are allowed.',
    minLength: 4,
    maxLength: 20,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_.-]+$/, {
    message:
      'username can only contain letters, numbers, dots, underscores, and hyphens',
  })
  username!: string;

  @ApiProperty({
    example: 'Password123',
    description:
      'Password must be between 8 and 32 characters and include uppercase, lowercase, and a number.',
    minLength: 8,
    maxLength: 32,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)/, {
    message: 'password too weak',
  })
  password!: string;
}
