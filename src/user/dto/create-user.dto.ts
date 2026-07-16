export class CreateUserDto {
  name!: string;
  slug!: string;
  email!: string;
  password!: string;
  avatar!: string;
  cover!: string;
  bio?: string | null;
  link?: string | null;
}
