import { Tweet } from '@prisma/client';

export class TweetEntity implements Tweet {
  id!: number;
  userSlug!: string;
  body!: string;
  image!: string | null;
  createdAt!: Date;
  answerOf!: number;
}
