import { HttpException, HttpStatus, Inject, CACHE_MANAGER, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync } from 'bcryptjs';
import { getRepository, Repository } from 'typeorm';
import { User } from '@libs/db/entity/user.entity';
import { Cache } from 'cache-manager'
import { WxLoginDto } from './type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService
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

 async wxLogin(param: WxLoginDto) {
   const { code } = param
   await this.wxUserInfo(code)
 }

 async wxUserInfo(code: string) {
  const AppID = this.configService.get('wx').AppID
  const AppSecret = this.configService.get('wx').AppSecret
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${AppID}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`
  const data: any = await fetch(url, { method: 'GET' })
  if (data.status === 200 && data.session_key) {

  }
 }

  /**
   * @Author: tao.wei
   * @description: token 获取个人信息
   * @param {number} id
   * @return {*}
   */
  async findMe(id: number): Promise<User> {
    const userInfo: User = await this.cacheManager.get(id.toString());
    if (userInfo) return userInfo
    const user = await this.repository.findOne(id, {
      // relations: ['userTag'],
    });
    await this.cacheManager.set(id.toString(), user, { ttl: 7200 });
    return user;
  }
}
