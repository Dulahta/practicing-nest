import { ApiProperty } from '@nestjs/swagger';

export class AuthTokensResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access-token.signature',
    description: 'Short-lived JWT used for protected resource endpoints.',
  })
  accessToken!: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh-token.signature',
    description: 'Longer-lived JWT used only to request fresh tokens.',
  })
  refreshToken!: string;
}
