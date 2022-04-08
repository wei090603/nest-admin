import { Article } from '@libs/db/entity/article.entity';
import { Category } from '@libs/db/entity/category.entity';
import { Tag } from '@libs/db/entity/tag.entity';
import { User } from '@libs/db/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageResult } from 'apps/shared/dto/page.dto';
import { In, Like, Not, Repository } from 'typeorm';
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
    const { title, content, image, tag, categoryId } = params
    const category = await this.categoryRepository.findOne(categoryId)
    // save 存在即更新不存在则插入
    const tagData = await this.tagRepository.save(tag)
    await this.articleRepository.save({
      title,
      content,
      image,
      category,
      author: user,
      tag: tagData
    })
  }

  async findAll(params: FindArticleDto, user: User): Promise<{ list: Article[], total: number }>{
    const { categoryId, page = 1, limit = 10 } = params
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

    const sql = this.articleRepository.createQueryBuilder("article");
    id !== 23 ? sql.orderBy('article.likes', 'DESC'): sql.orderBy('article.comments', 'DESC')

    return await sql
    .leftJoinAndSelect('article.author', 'author') // 注意这里
    .leftJoinAndSelect('article.category', 'category')
    .leftJoinAndSelect('article.tag', 'tag') // 注意这里
    .select('article')
    .addSelect('author.nickName') // 和这里
    .addSelect('category.id')
    .addSelect('category.title')
    .where({ category: In(ids) })
    .loadRelationCountAndMap("article.likeCount", "article.like", 'like', 
      qb => qb.andWhere("like.user = :user", { user: user.id } )
    )
    .where({ title: Not('') })
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
    .where("article.id = :id", { id })
    .getOne()
  }
}
