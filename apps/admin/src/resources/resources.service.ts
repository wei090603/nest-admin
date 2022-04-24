/*
 * @Description: 
 * @Author: tao.wei
 * @Date: 2021-09-22 14:57:34
 */
import { Resources } from '@libs/db/entity/resources.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    if (existing) throw new BadRequestException('路径已存在');
    // 查询出父级
    const parent = await this.repository.findOne(parentId);
    // 该子级的父级
    await this.repository.save({
      path,
      type,
      icon,
      title,
      parent
    });
    // 计算父级下存在的子级
    const count = await this.repository.createQueryBuilder().where({ parent }).getCount();
    // this.repository.update()
    // this.repository.save(parent);
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

  async update(id: number, data: UpdateResourceDto): Promise<number> {
    const resources = new Resources();
    resources.path = data.path
    resources.type = data.type
    resources.icon = data.icon
    resources.title = data.title
    if (parent) {
      // 查询出父级
      const parent = await this.repository.findOne(data.parentId);
      if (!parent) {
        throw new NotFoundException('没有找到父级');
      }
      // 该子级的父级
      resources.parent = parent;
      await this.repository.update(id, resources);
    }
    await this.repository.update(id, resources);
    return id
  }

  /**
   * @Author: tao.wei
   * @description: 删除菜单
   * @param {number} id
   * @return {*}
   */
   async remove(id: number): Promise<Resources>  {
    const resources = await this.repository.findOne(id);
    if (resources.count > 0) {
      throw new BadRequestException('存在子级不能删除');
    }
    return await this.repository.softRemove(resources);
  }
}
