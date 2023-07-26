import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
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
