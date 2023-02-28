import {
  Body,
  Get,
  Post,
  Req,
  UseGuards,
  Controller,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

import { User } from './decorators';
import { IPayloadJwt } from './auth.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';
import { CreateUserDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['userId'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@User() user: IPayloadJwt) {
    this.authService.logout(user.userId);
    return 'Logged out!';
  }
}
