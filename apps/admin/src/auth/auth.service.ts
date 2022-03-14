import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manager } from '@libs/db/entity/manager.entity';
import { getManager, Repository } from 'typeorm';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginLogger } from '@libs/db/entity/loginLogger.entity';
import { IptoaddressService } from '@libs/iptoaddress';
import { ApiException } from 'apps/shared/exceptions/api.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Manager) private readonly authRepository: Repository<Manager>,
    @InjectRepository(LoginLogger)
    private readonly loginLoggerRepository: Repository<LoginLogger>,
    private readonly jwtService: JwtService,
    private readonly iptoaddressService: IptoaddressService,
  ) {}
  
  public async login(manager: Manager, ip: string): Promise<{token: string}> {
    // 记录登录地址
    const loginAddress = await this.iptoaddressService.IpToAddress(ip)
    await this.loginLoggerRepository.insert({loginAddress, loginIp: ip, manager })
    const payload = { id: String(manager.id), account: manager.account };
    return { token: this.jwtService.sign(payload) };
  }


  public async validateUser( account: string, password: string ): Promise<Manager> {
    const user = await getManager().createQueryBuilder(Manager, "manager")
      .select(['manager.id', 'id'])
      .addSelect('manager.password')
      .addSelect('manager.account')
      .addSelect('manager.status')
      .where('manager.account = :account', { account })
      .getOne();
    if (!user) throw new ApiException(10404, '用户不存在');
    if (!user.status) throw new ApiException(10403, '用户被禁用');
    if (!compareSync(password, user.password)) throw new ApiException(10400, '用户名或密码不正确');
    return user
  }

  async findMe(id: number): Promise<Manager> {
    return await this.authRepository.findOne(id, {
      relations: ['roles'],
    });
  }
}
