import { Module } from '@nestjs/common';
import { ArticleLikeService } from './article-like.service';
import { ArticleLikeController } from './article-like.controller';

@Module({
  controllers: [ArticleLikeController],
  providers: [ArticleLikeService]
})
export class ArticleLikeModule {}
