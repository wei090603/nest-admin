import { User } from '@libs/db/entity/user.entity';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { user } from 'apps/shared/decorators/user.decorator';
import { JwtAuthGuard } from 'apps/shared/guards/guard.strategy';
import { CommentService } from './comment.service';
import { CreateCommenSubtDto, CreateCommentDto } from './type';

@ApiTags('评论管理')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加评论' })
  create(@Body() createCommentDto: CreateCommentDto, @user() user: User) {
    return this.commentService.create(createCommentDto, user);
  }

  @Post('sub')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加子级评论' })
  createSub(@Body() data: CreateCommenSubtDto, @user() user: User) {
    return this.commentService.createSub(data, user);
  }

  @Get('article/:id')
  @ApiOperation({ summary: '获取文章评论列表' })
  findComment (@Param('id') id: string) {
    return this.commentService.findComment(+id);
  }
  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
