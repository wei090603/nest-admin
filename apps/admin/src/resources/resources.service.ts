import { Resources } from '@libs/db/entity/resources.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'apps/shared/exceptions/api.exception';
import { Repository } from 'typeorm';
import { CreateResourceDto, UpdateResourceDto } from './dto';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resources)
    private readonly resourcesRepository: Repository<Resources>,
  ) {}

  async findOneByPath(path: string): Promise<Resources> {
    return await this.resourcesRepository.findOne({ where: { path } });
  }

  /**
   * @Author: tao.wei
   * @description: 添加资源
   * @param {CreateResourceDto} data
   * @return {*}
   */
  async create(data: CreateResourceDto) {
    const { path, type, icon, title, parentId } = data
    const existing = await this.findOneByPath(path);
    if (existing) throw new ApiException(10400, '路径已存在');
    // 查询出父级
    const parent = await this.resourcesRepository.findOne(parentId);
    await this.resourcesRepository.save({
      path,
      type,
      icon,
      title,
      parent
    });
    // 计算父级下存在的子级
    if (parent) {
      const level = await this.resourcesRepository.createQueryBuilder().where({ parent }).getCount();
      await this.resourcesRepository.update(parent.id, {
        level: level
      })
    }
  } 

  /**
   * @Author: tao.wei
   * @description: 查询所有资源
   * @param {*}
   * @return {*}
   */
  async findAll(): Promise<Resources[]> {
    // return await this.resourcesRepository.find({
    //   // relations: ['children'],
    //   // where: { parentId: null },
    //   order: { id: 'DESC' },
    // });
    return await this.resourcesRepository.find()
  }

  async update(id: number, data: UpdateResourceDto): Promise<void> {
    const { path, type, icon, title } = data
    await this.resourcesRepository.update(id, {
      path, type, icon, title, 
    });
  }

  /**
   * @Author: tao.wei
   * @description: 删除菜单
   * @param {number} id
   * @return {*}
   */
   async remove(id: number): Promise<Resources>  {
    const resources = await this.resourcesRepository.findOne(id);
    if (resources.level > 0) {
      throw new ApiException(10400, '存在子级不能删除');
    }
    return await this.resourcesRepository.softRemove(resources);
  }
}
