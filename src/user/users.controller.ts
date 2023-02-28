import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AccessTokenGuard, RolesGuard } from 'src/auth/guards';
import { Roles, User } from 'src/auth/decorators';
import { UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { IPayloadJwt } from 'src/auth/auth.interface';
import { Role } from './users.interface';

@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMyProfile(@User() user: IPayloadJwt) {
    return this.usersService.getUser(user.userId);
  }

  @Put('me')
  async updateMyProfile(
    @User() user: IPayloadJwt,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.updateUser(user.userId, updateUserDto);
    return this.usersService.getUser(user.userId);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.updateUser(id, updateUserDto);
    return this.usersService.getUser(id);
  }
}
