import { Article } from '@libs/db/entity/article.entity';
import { User } from '@libs/db/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '@libs/db/entity/comment.entity'
import { CreateCommenSubtDto, CreateCommentDto } from './type';
import { CommentSub } from '@libs/db/entity/commentSub.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    @InjectRepository(CommentSub) private readonly commentSubRepository: Repository<CommentSub>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // 添加评论
  async create(params: CreateCommentDto, user: User) {
    const { articleId, content } = params
    const article = await this.articleRepository.findOne(articleId)
    await this.commentRepository.insert({
      article,
      user,
      content
    })
  }

  // 添加子级评论
  async createSub(params: CreateCommenSubtDto, user: User) {
    const { parentId, content, replyId } = params
    const parent = await this.commentRepository.findOne(parentId)
    let reply: User
    if (replyId) {
      reply = await this.userRepository.findOne(replyId)
    }
    await this.commentSubRepository.insert({
      parent,
      content,
      user,
      reply
    })
  }

  // 根据文章id 获取评论列表
  async findComment(id: number) {
    const [list, total] = await this.commentRepository.createQueryBuilder("comment")
    .leftJoinAndSelect('comment.user', 'user')
    .leftJoinAndSelect('comment.children', 'children')
    .leftJoinAndSelect('children.user', 'childUser')
    .leftJoinAndSelect('children.reply', 'reply')
    .select('comment')
    .addSelect('user.id')
    .addSelect('user.avatar')
    .addSelect('user.nickName')
    .addSelect('children')
    .addSelect('childUser.id')
    .addSelect('childUser.avatar')
    .addSelect('childUser.nickName')
    .addSelect('reply.nickName')
    .where("comment.article = :article", { article: id})
    .orderBy('comment.id', 'ASC')
    .getManyAndCount()

    return { list, total }
  }


  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
