import { Article } from '@libs/db/entity/article.entity';
import { User } from '@libs/db/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '@libs/db/entity/comment.entity'
import { CreateCommentDto } from './type';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // 添加评论
  async create(params: CreateCommentDto, user: User) {
    const { articleId, parent, content } = params
  }

  // 根据文章id 获取评论列表
  async findComment(id: number) {
    return await this.commentRepository.find({
      relations: ['children'],
      select: ['user'],
      where: { parent: null, article: id },
      order: { id: 'ASC' },
    })
  }


  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
