import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginLogger } from '@libs/db/entity/loginLogger.entity';
import { Manager } from '@libs/db/entity/manager.entity';
import { getManager, Repository } from 'typeorm';
import { FindLoginLoggerDto, LoginLoggerInfo } from './type';
import { PageResult } from 'apps/shared/dto/page.dto';

@Injectable()
export class LoginLoggerService {
  constructor(
    @InjectRepository(LoginLogger)
    private readonly loginLoggerRepository: Repository<LoginLogger>,
  ) {}

  async findAll({ page = 1, limit = 10, ...params }: FindLoginLoggerDto) : Promise<PageResult<LoginLogger>> {
    const [list, total] = await getManager().createQueryBuilder(LoginLogger, "logger")
    .leftJoinAndSelect('logger.manager', 'manager') // 注意这里
    .select('logger')
    .addSelect('manager.account') // 和这里
    .where(params)
    .skip(limit * (page - 1))
    .take(limit)
    .getManyAndCount();

    return { list, total };
  }

  async remove(id: number) {
    await this.loginLoggerRepository.softRemove({ id });
  }
}
