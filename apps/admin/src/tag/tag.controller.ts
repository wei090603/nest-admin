import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'apps/shared/guards/roles.guard';
import { FindTagDto, TagInfo } from './dto';
import { PageTagList } from './res';
import { TagService } from './tag.service';

@ApiTags('标签管理')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOkResponse({ type: [PageTagList] })
  @ApiOperation({ summary: '获取标签列表' })
  async findAll(@Query() query: FindTagDto) {
    return await this.tagService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: '添加标签' })
  async create(@Body() data: TagInfo) {
    return this.tagService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: '修改标签信息' })
  async update(@Param('id') id: string, @Body() data: TagInfo) {
    return await this.tagService.update(+id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除标签', description: '删除标签' })
  async remove(@Param('id') id: string) {
    return await this.tagService.remove(+id);
  }
}
