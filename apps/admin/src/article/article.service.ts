import { Injectable } from '@nestjs/common';
import { FindArticleDto } from './type';
import { Article } from '@libs/db/entity/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async findAll(params: FindArticleDto): Promise<{ list: Article[], total: number }>{
    const { title = '', page = 1, limit = 10 } = params
    const [list, total] = await this.articleRepository.createQueryBuilder("article")
    .leftJoinAndSelect('article.author', 'author') // 控制返回参数
    .leftJoinAndSelect('article.tag', 'tag')
    .leftJoinAndSelect('article.category', 'category')
    .select('article')
    .addSelect('author.id')
    .addSelect('author.nickName') // 和这里
    .addSelect('author.avatar') // 和这里
    .addSelect('tag.id')
    .addSelect('tag.name')
    .addSelect('category.id')
    .addSelect('category.title')
    .where("article.title like :title", { title: `%${title}%` })
    .orderBy('article.id', 'DESC')
    .skip(limit * (page - 1))
    .take(limit)
    .getManyAndCount();
    return {list, total}
  }
}
