import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from '@libs/db/entity/roles.entity';
import { Repository } from 'typeorm';
import { CommonRoles, FindRolesDto } from './dto';
import { PageResult } from 'apps/shared/dto/page.dto';
import { ApiException } from 'apps/shared/exceptions/api.exception';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  async findAll({ page = 1, limit = 10, ...params }: FindRolesDto) : Promise<PageResult<Roles>> {
    const [list, total] = await this.rolesRepository.findAndCount({
      skip: limit * (page - 1),
      take: limit,
      where: params,
      order: { id: 'ASC' },
    });
    return { list, total };
  }

  async list(): Promise<Roles[]>  {
    return await this.rolesRepository.find({
      select: ['id', 'roleName'],
      order: { id: 'DESC' },
    })
  }

  async create(data: CommonRoles): Promise<void> {
    const { roleName, mark, remark } = data
    await this.findOneByAccount(roleName)
    await this.rolesRepository.insert({
      roleName, mark, remark
    });
  }


  // 检查账号是否存在
  async findOneByAccount(roleName: string) {
    const existing = await this.rolesRepository.findOne({ roleName });;
    if (existing) throw new ApiException(10400, '角色已存在');
  }
}
