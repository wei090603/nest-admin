/*
 * @Description: 
 * @Author: tao.wei
 * @Date: 2021-09-18 16:27:24
 */
import { BadRequestException, CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterCode, UpdateUserDto } from './type';
import { User } from '@libs/db/entity/user.entity';
import { getRepository, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcryptjs';
import { EmailService } from '@libs/email';
import { Article } from '@libs/db/entity/article.entity';
import { Cache } from 'cache-manager'
import { ApiException } from 'apps/shared/exceptions/api.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(data: CreateUserDto) {
    const { email, code, password } = data
    // 检查用户名是否存在
    const existing = await this.repository.findOne({ email });
    if (existing) throw new ApiException(10400, '该用户已注册');
    const value = await this.cacheManager.get(email);
    if (code !== value) throw new ApiException(10400, '验证码错误');
    await this.repository.insert({ email, password: hashSync(password) })
  }

  // 根据用户id获取用户文章列表
  async getArticle(user: User): Promise<Article[]> {
    return await this.articleRepository.find({
      relations: ['tag'],
      where: { author: user },
      order: {
        id: 'DESC'
      }
    })
  }

  findAll() {
    return `This action returns all user`;
  }

  // 根据用户id获取用户信息及文章
  async findOne(id: number, user: User): Promise<User> {
    // return await this.repository.findOne(id, {
    //   relations: ['article'],
    //   order: {
    //     id: 'DESC'
    //   }
    // })

    const userInfo =  await getRepository(User).createQueryBuilder("user")
      .leftJoinAndSelect("user.article", "article", "article.status = :status", { status: 1 })
      .leftJoinAndSelect("user.userTag", "tag")
      .orderBy("article.id", "DESC")
      .where("user.id = :id", { id })
      .getOne();
      return userInfo
  }

  async registerCode({ email }: RegisterCode) {
    await this.emailService.sendEmail(email, '倾说：邮箱注册验证码', 'code')
  }

  // 修改用户信息
  async update(user: User, dto: UpdateUserDto) {
    user.avatar = dto.avatar
    user.age = dto.age
    user.position = dto.position
    user.location = dto.location
    user.sex = dto.sex
    user.nickName = dto.nickName
    await this.repository.save(user)
  }

}
