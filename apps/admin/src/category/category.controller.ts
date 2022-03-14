import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { PageCategoryList, FindCategoryDto, CategoryInfo } from './type';

@ApiTags('文章分类管理')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOkResponse({ type: [PageCategoryList] })
  @ApiOperation({ summary: '获取标签列表' })
  async findAll(@Query() query: FindCategoryDto) {
    return await this.categoryService.findAll(query);
  }

  @Get('list')
  @ApiOkResponse({ type: [CategoryInfo] })
  @ApiOperation({ summary: '获取分类列表-无分页' })
  async list() {
    return await this.categoryService.list();
  }

  @Post()
  @ApiOperation({ summary: '添加标签' })
  async register(@Body() data: CategoryInfo) {
    return this.categoryService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: '修改标签信息' })
  async update(@Param('id') id: string, @Body() data: CategoryInfo) {
    return await this.categoryService.update(+id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除标签', description: '删除标签' })
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(+id);
  }
}
