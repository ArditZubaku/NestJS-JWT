import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot()],
})
export class AppModule {}
