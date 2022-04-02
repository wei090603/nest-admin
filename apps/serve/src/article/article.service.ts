import { Article } from '@libs/db/entity/article.entity';
import { Category } from '@libs/db/entity/category.entity';
import { Tag } from '@libs/db/entity/tag.entity';
import { User } from '@libs/db/entity/user.entity';
import { ArticleLike } from '@libs/db/entity/articleLike.entity';
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
  async create(params: CreateArticleDto, user: User) {
    const { title, content, image, tagId, categoryId } = params
    console.log(image, 'image');
    const category = await this.categoryRepository.findOne(categoryId)
    // save 存在即更新不存在则插入
    // const tag = await this.tagRepository.save(data.tag)

    try {
      await this.articleRepository.insert({
        title,
        content,
        image,
        category,
        author: user,
      })
    } catch (error) {
      console.log(error, 'error');
    }
  }

  async findAll({ page = 1, limit = 10, ...params }: FindArticleDto, user: User): Promise<{ list: Article[], total: number }>{
    const { categoryId } = params
    let ids: number[] = []

    if (categoryId) {
      const { id } = await this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect("category.children", "children")
      .select("GROUP_CONCAT(category.id)", "id")
      .select("GROUP_CONCAT(children.id)", "id")
      .where("category.id = :id", { id: categoryId })
      .getRawOne()
      ids = id.split(',')
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
    .loadRelationCountAndMap("article.likeCount", "article.like", 'like', 
      qb =>  qb.andWhere("like.user = :user", { user: user.id } ) 
    )
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

  // 根据分类Id 查询热门文章
  async findHot(id: number, user: User): Promise<Article[]>{
    const { chidlId } = await this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect("category.children", "children")
      // .select("GROUP_CONCAT(category.id)", "id")
      .select("GROUP_CONCAT(children.id)", "chidlId")
      .where("category.id = :id", { id })
      .getRawOne()
    const ids: number[] = chidlId.split(',')

    const qb = this.articleRepository.createQueryBuilder("article");
    id !== 23 ? qb.orderBy('article.likes', 'DESC'): qb.orderBy('article.comments', 'DESC')

    return await qb
    .leftJoinAndSelect('article.author', 'author') // 注意这里
    .leftJoinAndSelect('article.category', 'category')
    .leftJoinAndSelect('article.tag', 'tag') // 注意这里
    .select('article')
    .addSelect('author.nickName') // 和这里
    .addSelect('category.id')
    .addSelect('category.title')
    .where({ category: In(ids) })
    .take(3)
    .getMany();
  }

  // 查询文章详情
  async findOne(id: number, user: User) {

    this.articleRepository.createQueryBuilder()
      .update(Article)
      .set({ 
        reading: () => "reading + 1"
      })
      .where("id = :id", { id })
      .execute();

    return await this.articleRepository.createQueryBuilder("article")
    .leftJoinAndSelect('article.author', 'author')
    .leftJoinAndSelect('article.category', 'category')
    .leftJoinAndSelect('article.tag', 'tag')
    .select('article')
    .addSelect('author.id')
    .addSelect('author.nickName')
    .addSelect('author.avatar')
    .addSelect('category.id')
    .addSelect('category.title')
    .addSelect('tag.id')
    .addSelect('tag.name')
    .loadRelationCountAndMap("article.likeCount", "article.like", 'like', 
      qb => qb.andWhere("like.user = :user", { user: user.id } )
    )
    .getOne()
  }
}
