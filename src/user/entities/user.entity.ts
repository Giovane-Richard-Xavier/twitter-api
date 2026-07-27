import { User } from '@prisma/client';

export class UserEntity implements User {
  name!: string;
  slug!: string;
  email!: string;
  password!: string;
  avatar!: string;
  cover!: string;
  bio!: string | null;
  link!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
