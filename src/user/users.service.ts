import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isEmpty } from 'lodash';

import { UserEntity } from './entities/users.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getUser(userId: string): Promise<any> {
    const user = await this.findById(userId);
    if (!user) throw new BadRequestException("User doesn't exists");
    delete user.refreshToken;
    delete user.password;
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(userId: string): Promise<any> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async createUser(newUser: CreateUserDto): Promise<UserEntity | null> {
    const user = await this.usersRepository.create(newUser);
    return this.usersRepository.save(user);
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    if (isEmpty(updateUserDto)) {
      throw new BadRequestException('Provide body arguments');
    }
    return this.usersRepository.update(userId, updateUserDto);
  }
}
