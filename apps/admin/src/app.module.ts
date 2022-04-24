import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ManagerModule } from './manager/manager.module';
import { CommonModule } from '@libs/common';
import { RolesModule } from './roles/roles.module';
import { AdvertiseModule } from './advertise/advertise.module';
import { CategoryModule } from './category/category.module';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { MenuModule } from './menu/menu.module';
import { LinksModule } from './links/links.module';
import { LoginLoggerModule } from './login-logger/login-logger.module';
import { NoticeModule } from './notice/notice.module';
import { UploadModule } from './upload/upload.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    ManagerModule,
    RolesModule,
    AdvertiseModule,
    CategoryModule,
    ArticleModule,
    TagModule,
    MenuModule,
    LinksModule,
    LoginLoggerModule,
    NoticeModule,
    UploadModule,
    ResourcesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
