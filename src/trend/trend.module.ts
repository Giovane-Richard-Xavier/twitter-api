import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TrendController } from './trend.controller';
import { TrendService } from './trend.service';

@Module({
  imports: [PrismaModule],
  providers: [TrendService],
  controllers: [TrendController],
})
export class TrendModule {}
