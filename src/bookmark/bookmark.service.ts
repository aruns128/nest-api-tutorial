import {
  Injectable,
  Delete,
  Get,
  Patch,
  Post,
  ForbiddenException,
} from '@nestjs/common';
import { CreateBookMarkDto, EditBookMarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  getBookMarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  async createBookMarks(userId: number, dto: CreateBookMarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return bookmark;
  }

  async getBookMarksById(userId: number, bookmarkId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        id: bookmarkId,
        userId,
      },
    });

    return bookmarks;
  }

  async editBookMarksById(
    userId: number,
    bookmarkId: number,
    dto: EditBookMarkDto,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to the resource denied');
    }

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookMarksById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
