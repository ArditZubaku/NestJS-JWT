import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';

@Global()
@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot()],
  exports: [PrismaService],
})
export class AppModule {}
