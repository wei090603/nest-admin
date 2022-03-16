import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryList } from './type';

@ApiTags('分类管理')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}


  @Get()
  @ApiOkResponse({ type: CategoryList })
  @ApiOperation({ summary: '获取分类列表' })
  async findAll() {
    return await this.categoryService.findAll();
  }

}
