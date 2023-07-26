import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userID: number, email: string) {
    const [at, rt] = await Promise.all([
      // Access token
      this.jwtService.signAsync(
        {
          sub: userID,
          email,
        },
        {
          secret: this.config.get('AT_SECRET'),
          expiresIn: 60 * 15, // In seconds
        },
      ),
      // Refresh token
      this.jwtService.signAsync(
        {
          sub: userID,
          email,
        },
        {
          secret: this.config.get('RT_SECRET'),
          expiresIn: 60 * 60 * 24 * 7, // In seconds
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async localSignup(dto: AuthDto): Promise<Tokens> {
    const { email, password } = dto;

    const hash = await this.hashData(password);

    const user = await this.prismaService.user.create({
      data: {
        email,
        hash,
      },
    });

    return undefined;
  }

  localSignin() {}

  logout() {}

  refreshTokens() {}
}
