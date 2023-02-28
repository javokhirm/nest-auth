import { Role } from 'src/user/users.interface';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IPayloadJwt {
  userId: string;
  username: string;
  role: Role;
}
