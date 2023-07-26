import { Module } from '@nestjs/common';
exports;

import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
})
export class PrismaModule {}
