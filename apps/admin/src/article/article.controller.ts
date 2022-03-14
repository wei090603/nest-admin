import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Manager } from '@libs/db/entity/manager.entity';
import { ArticleService } from './article.service';
import { CreateArticleDto, FindArticleDto, PageArticleList } from './type';

@ApiTags('文章管理')
@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiOperation({ summary: '添加文章' })
  async create(@Body() data: CreateArticleDto) {
    return this.articleService.create(data);
  }

  @Get()
  @ApiOkResponse({ type: [PageArticleList] })
  @ApiOperation({ summary: '获取文章列表' })
  async findAll(@Query() query: FindArticleDto) {
    return await this.articleService.findAll(query);
  }

}
