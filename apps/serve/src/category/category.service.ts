import { Category } from '@libs/db/entity/category.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]>  {
    return await this.categoryRepository.find({
      select: ['id', 'title'],
      order: { id: 'DESC' },
    })
  }
}
