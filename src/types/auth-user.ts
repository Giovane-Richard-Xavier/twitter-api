import { UserEntity } from '../user/entities/user.entity';

export type AuthUser = {
  slug: string;
  name: string;
  email: string;
};

export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
};

export type SafeUser = Omit<UserEntity, 'password'>;
