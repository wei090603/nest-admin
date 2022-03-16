import { Category } from '@libs/db/entity/category.entity';
import { Tag } from '@libs/db/entity/tag.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Like, Repository } from 'typeorm';
import { FindTagDto } from './type';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(query: FindTagDto): Promise<Tag[]>  {
    const { name } = query
    return await this.tagRepository.find({
      select: ['id', 'name'],
      where: {name: Like(`%${name ?? ''}%`)},
      order: { id: 'DESC' },
    })
  }

  async findHot(): Promise<Tag[]> {
    return await getManager().createQueryBuilder(Tag, 'tag')
    .innerJoinAndSelect("tag.article", "article")
    .select("Count(tag.id)", "count")
    .addSelect('tag.id', 'id')
    .addSelect('tag.name', 'name')
    .groupBy('tag.id')
    .orderBy('count', 'DESC')
    .take(10)
    .getRawMany()
  }
}
