import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto, FindArticleDto, PageArticleList } from './type';
import { RolesGuard } from 'apps/shared/guards/roles.guard';

@ApiTags('文章管理')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiOkResponse({ type: [PageArticleList] })
  @ApiOperation({ summary: '获取文章列表' })
  async findAll(@Query() query: FindArticleDto) {
    return await this.articleService.findAll(query);
  }

}
