import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { RtGuard } from '../common/guards';
import {
  GetCurrentUser,
  GetCurrentUserID,
  Public,
} from '../common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  localSignup(
    @Body() dto: AuthDto,
  ): Promise<Tokens> {
    return this.authService.localSignup(dto);
  }

  @Public()
  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  localSignin(
    @Body() dto: AuthDto,
  ): Promise<Tokens> {
    console.log({
      ...dto,
    });
    return this.authService.localSignin(dto);
  }

  // @UseGuards(AtGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserID() userID: number) {
    return this.authService.logout(userID);
  }

  @Public() // Bypass the AtGuard then execute the RtGuard
  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserID() userID: number,
    @GetCurrentUser('refreshToken')
    refreshToken: string,
  ) {
    return this.authService.refreshTokens(
      userID,
      refreshToken,
    );
  }
}
