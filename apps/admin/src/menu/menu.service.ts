import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '@libs/db/entity/menu.entity';
import { Repository } from 'typeorm';
import { FindMenuDto, MenuInfo } from './dto';
import { ApiException } from 'apps/shared/exceptions/api.exception';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async findAll(query: FindMenuDto): Promise<Menu[]>  {
    return await this.menuRepository.find({
      where: query,
      order: { sort: 'ASC', id: 'DESC' },
    })
  }

  async create(data: MenuInfo) {
    const { title, link, sort } = data
    const existing = await this.menuRepository.findOne({ title });;
    if (existing) throw new ApiException(10400, '导航名已存在');
    await this.menuRepository.insert({ title, link, sort });
  }

  async update(id: number, data: MenuInfo) {
    const { title, link, sort } = data
    await this.menuRepository.update(id, { title, link, sort });
  }

  async remove(id: number) {
    await this.menuRepository.softRemove({ id });
  }
}
