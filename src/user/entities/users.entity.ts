import { IsEmail } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../users.interface';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;
}
