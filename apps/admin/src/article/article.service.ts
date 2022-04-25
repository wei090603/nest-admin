import { Injectable } from '@nestjs/common';
import { CreateArticleDto, FindArticleDto } from './type';
import { Article } from '@libs/db/entity/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PageResult } from 'apps/shared/dto/page.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async findAll({ page = 1, limit = 10, ...params }: FindArticleDto) : Promise<PageResult<Article>> {
    const { title } = params
    const [list, total] = await this.articleRepository.findAndCount({
      skip: limit * (page - 1),
      take: limit,
      where: { title: Like(`%${title}%`)},
      order: { id: 'DESC' },
    });
    return { list, total };
  }

  async create(data: CreateArticleDto) {
    console.log(data, 'data');
    // await this.articleRepository.insert();
  }

}
