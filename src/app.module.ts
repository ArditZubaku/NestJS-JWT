import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';

@Global()
@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot(),
  ],
  // Second way (more scalable)
  // Now the AtGuard is going to require the access_token for everything
  // Even for the routes that are not annotated with the @UseGuards() decorator
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
