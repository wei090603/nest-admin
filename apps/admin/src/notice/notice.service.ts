import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from '@libs/db/entity/notice.entity';
import { Repository } from 'typeorm';
import { CreateNoticDto, FindNoticeDto, NoticeInfo } from './dto';
import { PageResult } from 'apps/shared/dto/page.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  async findAll({ page = 1, limit = 10, ...params }: FindNoticeDto) : Promise<PageResult<Notice>> {
    const [list, total] = await this.noticeRepository.findAndCount({
      skip: limit * (page - 1),
      take: limit,
      where: params,
      order: { id: 'DESC' },
    });
    return { list, total };
  }

  async create(data: CreateNoticDto) {
    await this.noticeRepository.insert(data);
  }

  async update(id: number, data: CreateNoticDto) {
    const { title, type, content, status } = data
    await this.noticeRepository.update(id, { title, type, content, status });
  }

  async findOne(id: number): Promise<NoticeInfo> {
    return await this.noticeRepository.findOne(id)
  }
}
