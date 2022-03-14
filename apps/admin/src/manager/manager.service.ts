import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manager } from '@libs/db/entity/manager.entity';
import { getManager, Like, Repository } from 'typeorm';
import { hashSync } from 'bcryptjs';
import { CreateManagerDto, FindManagerDto } from './dto';
import { Roles } from '@libs/db/entity/roles.entity';
import { PageResult } from 'apps/shared/dto/page.dto';
import { ApiException } from 'apps/shared/exceptions/api.exception';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  async findAll({ page = 1, limit = 10, ...params }: FindManagerDto) : Promise<PageResult<Manager>> {
    const [list, total] = await this.managerRepository.findAndCount({
      relations: ['roles'],
      skip: limit * (page - 1),
      take: limit,
      where: { account: Like(`%${params.account}%`), name: Like(`%${params.name}%`), phone: Like(`%${params.phone}%`) },
      order: { id: 'DESC' },
    });
    return { list, total };
  }

  async create(data: CreateManagerDto) {
    const { account, email, name, remark, phone, roles } = data
    await this.findOneByAccount(account)
    const result = await this.managerRepository.save({
      account, email, name, remark, phone
    });
    const role = await this.rolesRepository.findByIds(roles);
    await this.managerRepository.save({
      id: result.id,
      roles: role
    })
    // const rolesList = await getManager().createQueryBuilder(Roles, "roles").where('roles.id IN (:...ids)', { ids: roles }).getMany();
  }

  async updated(id: number, data: CreateManagerDto) {
    const { email, name, phone, remark, roles } = data
    const role = await this.rolesRepository.findByIds(roles);
    await this.managerRepository.update(id, {
      email, name, phone, remark
    });
    await this.managerRepository.save({
      id,
      roles: role
    })
  }

  async updateStatus(id: number) {
    const existing = await this.managerRepository.findOne(id);
    await this.managerRepository.update(id, {
      status: !existing.status
    });
  }

  async restPassword(id: number) {
    await this.managerRepository.update(id, { password: hashSync('123456') });
  }

  async remove(id: number) {
    await this.managerRepository.softRemove({ id });
  }

  // 检查账号是否存在
  async findOneByAccount(account: string) {
    const existing = await this.managerRepository.findOne({ account });;
    if (existing) throw new ApiException(10400, '用户已存在');
  }
}
