import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async findAll(genreId?: string, search?: string, page = '1', limit = '10') {
    const take = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const pageNum = Math.max(Number(page) || 1, 1);
    const where = {
      ...(genreId && { genreId: Number(genreId) }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { author: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };
    const [data, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: { genre: true },
        skip: (pageNum - 1) * take,
        take,
        orderBy: { id: 'asc' },
      }),
      this.prisma.book.count({ where }),
    ]);
    return { data, total, page: pageNum, limit: take, totalPages: Math.ceil(total / take) };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id }, include: { genre: true } });
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }

  async create(dto: CreateBookDto) {
    const genre = await this.prisma.genre.findUnique({ where: { id: dto.genreId } });
    if (!genre) throw new NotFoundException(`Genre ${dto.genreId} not found`);
    try {
      return await this.prisma.book.create({ data: dto });
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('A book with this ISBN already exists');
      throw e;
    }
  }

  async update(id: number, dto: UpdateBookDto) {
    await this.findOne(id);
    return this.prisma.book.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }
}