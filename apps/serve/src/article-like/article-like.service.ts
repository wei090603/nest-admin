import { Article } from '@libs/db/entity/article.entity';
import { ArticleLike } from '@libs/db/entity/articleLike.entity';
import { User } from '@libs/db/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    this.articleRepository.update(articleId, {
      likes: article.likes + 1
    })
  }

  async remove(id: number, user: User) {
    const article = await this.articleRepository.findOne(id)
    const like = await this.articleLikeRepository.findOne({ article, user });
    this.articleRepository.update(id, {
      likes: article.likes - 1
    })
    this.articleLikeRepository.remove(like)
  }
}
