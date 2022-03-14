import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@libs/db/entity/category.entity';
import { Repository } from 'typeorm';
import { CategoryInfo, FindCategoryDto } from './type';
import { PageResult } from 'apps/shared/dto/page.dto';
import { ApiException } from 'apps/shared/exceptions/api.exception';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll({ page = 1, limit = 10, ...params }: FindCategoryDto) : Promise<PageResult<Category>> {
    const [list, total] = await this.categoryRepository.findAndCount({
      skip: limit * (page - 1),
      take: limit,
      where: params,
      order: { id: 'DESC' },
    });
    return { list, total };
  }

  async list(): Promise<Category[]>  {
    return await this.categoryRepository.find({
      select: ['id', 'title'],
      order: { id: 'DESC' },
    })
  }

  async create(data: CategoryInfo) {
    const { title } = data
    const existing = await this.categoryRepository.findOne({ title });;
    if (existing) throw new ApiException(10400, '分类名已存在');
    await this.categoryRepository.insert({ title });
  }

  async update(id: number, data: CategoryInfo) {
    const { title } = data
    await this.categoryRepository.update(id, { title });
  }

  async remove(id: number) {
    await this.categoryRepository.softRemove({ id });
  }
}
