import { Resources } from '@libs/db/entity/resources.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'apps/shared/exceptions/api.exception';
import { TreeRepository } from 'typeorm';
import { CreateResourceDto, UpdateResourceDto } from './dto';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resources)
    private readonly repository: TreeRepository<Resources>,
  ) {}

  async findOneByData(path: string): Promise<Resources> {
    return await this.repository.findOne({ where: { path } });
  }

  /**
   * @Author: tao.wei
   * @description: 添加资源
   * @param {CreateResourceDto} data
   * @return {*}
   */
  async create(data: CreateResourceDto) {
    const { path, type, icon, title, parentId } = data
    const existing = await this.findOneByData(path);
    if (existing) throw new ApiException(10400, '路径已存在');
    // 查询出父级
    const parent = await this.repository.findOne(parentId);
    await this.repository.save({
      path,
      type,
      icon,
      title,
      parent
    });
    // 计算父级下存在的子级
    // const count = await this.repository.createQueryBuilder().where({ parent }).getCount();
  } 

  /**
   * @Author: tao.wei
   * @description: 查询所有资源
   * @param {*}
   * @return {*}
   */
  async findAll(): Promise<Resources[]> {
    return await this.repository.findTrees();
  }

  async update(id: number, data: UpdateResourceDto): Promise<void> {
    const { path, type, icon, title, parentId } = data
    const parent = await this.repository.findOne(parentId);
    await this.repository.update(id, {
      path, type, icon, title, parent
    });
  }

  /**
   * @Author: tao.wei
   * @description: 删除菜单
   * @param {number} id
   * @return {*}
   */
   async remove(id: number): Promise<Resources>  {
    const resources = await this.repository.findOne(id);
    if (resources.level > 0) {
      throw new ApiException(10400, '存在子级不能删除');
    }
    return await this.repository.softRemove(resources);
  }
}
