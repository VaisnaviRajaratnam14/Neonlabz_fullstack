import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase() },
      });

      if (existing) {
        throw new BadRequestException('Email is already registered');
      }

      const passwordHash = await hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
        },
      });

      const token = await this.signToken({ sub: user.id, email: user.email });
      return {
        accessToken: token,
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      this.rethrowPrismaConnectionError(error);
      throw error;
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase() },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isValid = await compare(dto.password, user.passwordHash);
      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = await this.signToken({ sub: user.id, email: user.email });
      return {
        accessToken: token,
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      this.rethrowPrismaConnectionError(error);
      throw error;
    }
  }

  private rethrowPrismaConnectionError(error: unknown): never | void {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new ServiceUnavailableException(
        'Database connection failed. Update DATABASE_URL in backend/.env and restart backend.',
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P1000'
    ) {
      throw new ServiceUnavailableException(
        'Invalid database credentials. Update DATABASE_URL in backend/.env and restart backend.',
      );
    }
  }

  private async signToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }
}
