import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/auth.dto';
import { IPayloadJwt, ITokens } from './auth.interface';
import { UsersService } from 'src/user/users.service';
import { CreateUserDto } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.usersService.findByEmail(createUserDto.email);

    if (user) throw new BadRequestException('User already exists');

    const hashedPassword = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    const tokens = await this.getTokens({
      userId: newUser.id,
      username: newUser.email,
      role: newUser.role,
    });
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;
    const user = await this.usersService.findByEmail(username);
    if (!user) throw new BadRequestException('Username is wrong');

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) throw new BadRequestException('Password is wrong');

    const tokens = await this.getTokens({
      userId: user.id,
      username: user.email,
      role: user.role,
    });

    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    this.usersService.updateUser(userId, { refreshToken: null });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens({
      userId: user.id,
      username: user.email,
      role: user.role,
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  async getTokens(payload: IPayloadJwt): Promise<ITokens> {
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_ACCESS_SECRET'),
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
