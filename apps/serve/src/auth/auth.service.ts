import { HttpException, HttpStatus, Inject, CACHE_MANAGER, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync } from 'bcryptjs';
import { getRepository, Repository } from 'typeorm';
import { User } from '@libs/db/entity/user.entity';
// import { Cache } from 'cache-manager'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  /**
   * @Author: tao.wei
   * @description: 登录验证成功后处理
   * @param {Manager} dto
   * @return {*}
   */
  login(data: User): Object {
    const payload = { id: String(data.id), account: data.account };
    return { token: this.jwtService.sign(payload) };
  }

  /**
   * @Author: tao.wei
   * @description: 用户登录验证
   * @param {*}
   * @return {*}
   */
  public async validateUser(
    account: string,
    password: string,
  ): Promise<User> {
    const user = await getRepository(User)
      .createQueryBuilder('user')
      .select(['user.id', 'id'])
      .addSelect('user.password')
      .addSelect('user.account')
      .addSelect('user.status')
      .where('user.account = :account OR user.email = :email OR user.phoneNum = :phoneNum' , { account, email: account, phoneNum: account })
      .printSql()
      .getOne();
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND)
    }
    if (!user.status) {
      throw new HttpException('用户被禁用', HttpStatus.FORBIDDEN);
    }
    if (!compareSync(password, user.password)) {
      throw new HttpException('用户名或密码不正确', HttpStatus.BAD_REQUEST)
    }
    return user;
  }

  /**
   * @Author: tao.wei
   * @description: token 获取个人信息
   * @param {number} id
   * @return {*}
   */
  async findMe(id: number): Promise<User> {
    let userInfo: User
    // userInfo = await this.cacheManager.get(id.toString());
    if (!userInfo) {
      userInfo = await this.repository.findOne(id, {
        relations: ['userTag'],
      });
    //   await this.cacheManager.set(id.toString(), userInfo, { ttl: 7200 });
    }
    return userInfo
  }
}
