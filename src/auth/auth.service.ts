import { ForbiddenException, Injectable } from '@nestjs/common';
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

  async localSignup(dto: AuthDto): Promise<Tokens> {
    const { email, password } = dto;
    const hash = await this.hashData(password);

    const user = await this.prismaService.user.create({
      data: {
        email,
        hash,
      },
    });
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async localSignin(dto: AuthDto): Promise<Tokens> {
    const { email, password } = dto;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new ForbiddenException('No user with this email exists!');

    const passwordMatches: boolean = await bcrypt.compare(password, user.hash);
    if (!passwordMatches) throw new ForbiddenException('Wrong password!');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userID: number) {
    await this.prismaService.user.updateMany({
      where: {
        id: userID,
        hashedRefreshToken: {
          not: null,
        },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
  }

  refreshTokens(userID: number, rt: string) {}

  async updateRtHash(userID: number, rt: string): Promise<void> {
    const hash: string = await this.hashData(rt);
    await this.prismaService.user.update({
      where: {
        id: userID,
      },
      data: {
        hashedRefreshToken: hash,
      },
    });
  }

  //Util functions
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
}
