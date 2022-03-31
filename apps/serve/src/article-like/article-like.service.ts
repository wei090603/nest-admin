import { Article } from '@libs/db/entity/article.entity';
import { ArticleLike } from '@libs/db/entity/articleLike.entity';
import { User } from '@libs/db/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { CreateArticleLikeDto } from './type';

@Injectable()
export class ArticleLikeService {
  constructor(
    @InjectRepository(ArticleLike) private readonly articleLikeRepository: Repository<ArticleLike>,
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
  ) {}


  // 添加文章点赞
  async create(params: CreateArticleLikeDto, user: User) {
    const { articleId } = params
    const article = await this.articleRepository.findOne(articleId)
    await this.articleLikeRepository.insert({ user, article })

    await this.articleRepository.createQueryBuilder()
      .update(Article)
      .set({ 
        likes: () => "likes + 1"
      })
      .where("id = :id", { id: articleId })
      .execute();
  }

  async remove(id: number, user: User) {
    const article = await this.articleRepository.findOne(id)
    const like = await this.articleLikeRepository.findOne({ article, user });
    await this.articleLikeRepository.remove(like)
    await this.articleRepository
      .createQueryBuilder()
      .update(Article)
      .set({ 
        likes: () => "likes - 1"
      })
      .where("id = :id", { id })
      .execute();
  }
}
