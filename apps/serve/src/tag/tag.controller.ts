import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { FindTagDto, TagList } from './type';

@ApiTags('标签管理')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOkResponse({ type: TagList })
  @ApiOperation({ summary: '获取标签列表' })
  async findAll(@Query() query: FindTagDto) {
    return await this.tagService.findAll(query);
  }

  @Get('hot')
  @ApiOkResponse({ type: TagList })
  @ApiOperation({ summary: '获取热门标签列表' })
  async findHot() {
    return await this.tagService.findHot();
  }
}
