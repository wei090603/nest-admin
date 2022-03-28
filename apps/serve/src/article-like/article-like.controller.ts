import { User } from '@libs/db/entity/user.entity';
import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { user } from 'apps/shared/decorators/user.decorator';
import { JwtAuthGuard } from 'apps/shared/guards/guard.strategy';
import { ArticleLikeService } from './article-like.service';
import { CreateArticleLikeDto } from './type';

@ApiTags('文章点赞')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('article-like')
export class ArticleLikeController {
  constructor(private readonly articleLikeService: ArticleLikeService) {}

  @Post()
  @ApiOperation({ summary: '添加点赞' })
  create(@Body() createLikeArticleDto: CreateArticleLikeDto, @user() user: User) {
    return this.articleLikeService.create(createLikeArticleDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: '取消点赞' })
  remove(@Param('id') id: string, @user() user: User) {
    return this.articleLikeService.remove(+id, user);
  }
}
