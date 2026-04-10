import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService, AuthTokens } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthTokensResponseDto } from './dto/auth-tokens-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { GetUser } from './get-user.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { User } from './user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account with validated username and password rules.',
  })
  @ApiCreatedResponse({
    description: 'User account created successfully.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed for username or password.',
  })
  @ApiConflictResponse({
    description: 'The username already exists.',
  })
  register(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.authService.register(authCredentialsDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Log in and receive JWT tokens',
    description:
      'Validates credentials and returns an access token plus a refresh token.',
  })
  @ApiOkResponse({
    description: 'Login succeeded and tokens were issued.',
    type: AuthTokensResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed for username or password.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid username or password.',
  })
  login(@Body() authCredentialsDto: AuthCredentialsDto): Promise<AuthTokens> {
    return this.authService.login(authCredentialsDto);
  }

  @Post('/refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('refresh-token')
  @ApiOperation({
    summary: 'Refresh access and refresh tokens',
    description:
      'Send the refresh token in the Authorization Bearer header to rotate both tokens.',
  })
  @ApiOkResponse({
    description: 'New access and refresh tokens were issued.',
    type: AuthTokensResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired refresh token.',
  })
  refresh(@GetUser() user: User): Promise<AuthTokens> {
    return this.authService.refreshTokens(user);
  }
}
