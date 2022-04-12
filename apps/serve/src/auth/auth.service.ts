import { HttpException, HttpStatus, Inject, CACHE_MANAGER, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync } from 'bcryptjs';
import { getRepository, Repository } from 'typeorm';
import { User } from '@libs/db/entity/user.entity';
import { Cache } from 'cache-manager'
import { WxLoginDto, WxUser } from './type';
import { ConfigService } from '@nestjs/config';
import { ApiException } from 'apps/shared/exceptions/api.exception';
import WXBizDataCrypt from './utils/WXBizDataCrypt'
import { hashSync } from 'bcryptjs';
import { getTemAccount } from 'apps/shared/utils';

import axios from 'axios';
import * as crypto from 'crypto'

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
  public async validateUser( account: string, password: string ):Promise<User> {
    const user = await getRepository(User)
      .createQueryBuilder('user')
      .select(['user.id', 'id'])
      .addSelect('user.password')
      .addSelect('user.account')
      .addSelect('user.status')
      .where('user.account = :account OR user.email = :email OR user.mobile = :mobile' , { account, email: account, mobile: account })
      .getOne();
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND)
    }
    if (!user.status) {
      throw new HttpException('用户被禁用', HttpStatus.FORBIDDEN);
    }
    if (!compareSync(password, user.password)) {
      throw new ApiException(10400, '用户名或密码不正确');
    }
    return user
  }

  // 微信授权登录
  async wxLogin(param: WxLoginDto) {
    const { code, user } = param
    const wxUserInfo = await this.wxUserInfo(code, user)
    let result: User;
    result = await this.repository.findOne({ where: { openId: wxUserInfo.openId } })
    const pwd = getTemAccount()
    const account = getTemAccount('lh')
    if (!result) {
      result = await this.repository.save({ 
        nickName: wxUserInfo.nickName,
        account: account,
        avatar: wxUserInfo.avatarUrl,
        password: hashSync(pwd),
        sex: wxUserInfo.gender,
        openId: wxUserInfo.openId
      })
    }
    const payload = { id: String(result.id), account: result.account };
    return { token: this.jwtService.sign(payload) };
  }

 // 校验微信信息
 async wxUserInfo(code: string, user: WxUser) {
  const AppID = this.configService.get('wx').AppID
  const AppSecret = this.configService.get('wx').AppSecret
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${AppID}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`
  const data: any  = await axios.get(url)
  if (data.status === 200 && data.data.session_key) {
    const sessionKey = data.data.session_key
    const { rawData, signature, encryptedData, iv } = user
    const sha1 = crypto.createHash('sha1')
    sha1.update(rawData)
    sha1.update(sessionKey)
    if (sha1.digest('hex') !== signature) {
      throw new ApiException(10400, '用户签名校验失败');
    }
    const pc = new WXBizDataCrypt(AppID, sessionKey)
    return {...pc.decryptData(encryptedData, iv), openId: data.data.openid}
  } else {
    throw new ApiException(10400, '微信授权失败');
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
    const user = await this.repository.findOne(id, {
      relations: ['userTag'],
    });
    await this.cacheManager.set(id.toString(), user, { ttl: 7200 });
    return user;
  }
}
