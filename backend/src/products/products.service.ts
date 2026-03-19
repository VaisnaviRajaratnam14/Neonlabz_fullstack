import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateProductDto) {
    try {
      return await this.prisma.product.create({
        data: {
          ...dto,
          ownerId: userId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Product ID already exists. Use a different ID.');
      }
      throw error;
    }
  }

  findAll(userId: number) {
    return this.prisma.product.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: number, id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.ownerId !== userId) {
      throw new ForbiddenException('You cannot access this product');
    }
    return product;
  }

  async update(userId: number, id: number, dto: UpdateProductDto) {
    await this.findOne(userId, id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    return this.prisma.product.delete({ where: { id } });
  }
}
