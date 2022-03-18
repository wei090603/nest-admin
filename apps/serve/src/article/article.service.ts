import { Article } from '@libs/db/entity/article.entity';
import { Category } from '@libs/db/entity/category.entity';
import { Tag } from '@libs/db/entity/tag.entity';
import { User } from '@libs/db/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageResult } from 'apps/shared/dto/page.dto';
import { getManager, Like, Repository } from 'typeorm';
import { CreateArticleDto, FindArticleDto, SearchArticleDto } from './type';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}
  
  // 创建新文章
  async create(data: CreateArticleDto, user: User): Promise<Article> {
    const article = new Article()
    if (data.category) {
      const category = await this.categoryRepository.findOne(data.category)
      article.category = category
    }
    // save 存在即更新不存在则插入
    if (data.tag.length) {
      const tag = await this.tagRepository.save(data.tag)
      article.tag = tag
    }
    
    article.content = data.content
    article.author = user

    return this.articleRepository.save(article)
  }

  async findAll({ page = 1, limit = 10, ...params }: FindArticleDto, user: User): Promise<{ list: Article[], total: number }>{
    const { categoryId } = params
    // const category = categoryId ? await this.categoryRepository.findOne(categoryId) : ''
    // const [list, total] = await this.articleRepository.findAndCount({
    //   relations: ['author', 'tag'],
    //   skip: limit * (page - 1),
    //   take: limit,
    //   order: { id: 'DESC' },
    // })
    const [list, total] = await getManager().createQueryBuilder(Article, "article")
    .leftJoinAndSelect('article.author', 'author') // 注意这里
    .leftJoinAndSelect('article.tag', 'tag') // 注意这里
    .select('article')
    .addSelect('author.id')
    .addSelect('author.nickName') // 和这里
    .addSelect('author.avatar') // 和这里
    .addSelect('tag.name')
    .where(params)
    .skip(limit * (page - 1))
    .take(limit)
    .getManyAndCount();

    return {list, total}
  }


  async findSearch({ page = 1, limit = 10, title = '' }: SearchArticleDto, user: User): Promise<PageResult<Article>> {
    const [list, total] = await this.articleRepository.findAndCount({
      relations: ['author', 'tag'],
      where: { title: Like(`%${title}%`) },
      skip: limit * (page - 1),
      take: limit,
      order: { id: 'DESC' },
    })
    return {list, total}
  }

}
