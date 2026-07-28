import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrendService {
  constructor(private readonly prisma: PrismaService) {}

  async getTrends() {
    const trends = await this.prisma.trend.findMany({
      select: {
        hashtag: true,
        counter: true,
      },
      orderBy: { counter: 'desc' },
      take: 4,
    });

    return trends;
  }
}
