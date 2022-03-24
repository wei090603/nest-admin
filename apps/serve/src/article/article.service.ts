import { Article } from '@libs/db/entity/article.entity';
import { Category } from '@libs/db/entity/category.entity';
import { Tag } from '@libs/db/entity/tag.entity';
import { User } from '@libs/db/entity/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageResult } from 'apps/shared/dto/page.dto';
import { getManager, In, Like, Repository } from 'typeorm';
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
    const ids: number[] = []

    if (categoryId) {
      const { id } = await this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect("category.children", "children")
      .select("GROUP_CONCAT(category.id)", "id")
      .select("GROUP_CONCAT(children.id)", "id")
      .where("category.id = :id", { id: categoryId })
      .getRawOne()
      ids.push(id)
    }
    const qb = this.articleRepository.createQueryBuilder("article");
    ids.length === 0 ? qb: qb.where({ category: In(ids) })

    const [list, total] = await qb
    .leftJoinAndSelect('article.author', 'author') // 注意这里
    .leftJoinAndSelect('article.tag', 'tag') // 注意这里
    .leftJoinAndSelect('article.category', 'category')
    .select('article')
    .addSelect('author.id')
    .addSelect('author.nickName') // 和这里
    .addSelect('author.avatar') // 和这里
    .addSelect('tag.id')
    .addSelect('tag.name')
    .addSelect('category.id')
    .addSelect('category.title')
    .orderBy('article.id', 'DESC')
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
