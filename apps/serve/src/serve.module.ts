import { Module } from '@nestjs/common';
import { ServeController } from './serve.controller';
import { ServeService } from './serve.service';
import { CommonModule } from '@libs/common/common.module';
import { UserModule } from './user/user.module';
import { AdvertiseModule } from './advertise/advertise.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { ArticleLikeModule } from './article-like/article-like.module';
import { UploadModule } from './upload/upload.module';
import { UserTagModule } from './user-tag/user-tag.module';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    AdvertiseModule,
    CategoryModule,
    TagModule,
    ArticleModule,
    AuthModule,
    CommentModule,
    ArticleLikeModule,
    UploadModule,
    UserTagModule,
    NoticeModule,
  ],
  controllers: [ServeController],
  providers: [ServeService],
})
export class ServeModule {}
