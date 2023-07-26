import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  localSignup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.localSignup(dto);
  }

  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  localSignin(@Body() dto: AuthDto) {
    console.log({
      ...dto,
    });
    return this.authService.localSignin(dto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(userID: number) {
    // return this.authService.logout(userID);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens() {
    // return this.authService.refreshTokens();
  }
}
