import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbService } from './db.service';
import { Advertise } from './entity/advertise.entity';
import { Article } from './entity/article.entity';
import { ArticleLike } from './entity/articleLike.entity';
import { Category } from './entity/category.entity';
import { Comment } from './entity/comment.entity';
import { CommentSub } from './entity/commentSub.entity';
import { Links } from './entity/links.entity';
import { LoginLogger } from './entity/loginLogger.entity';
import { Manager } from './entity/manager.entity';
import { Menu } from './entity/menu.entity';
import { Notice } from './entity/notice.entity';
import { Resources } from './entity/resources.entity';
import { Roles } from './entity/roles.entity';
import { Tag } from './entity/tag.entity';
import { User } from './entity/user.entity';


const table = [
  Manager, 
  LoginLogger, 
  Roles,
  Resources,
  Advertise,
  Article,
  Category,
  Tag,
  Links,
  Notice,
  Menu,
  User,
  ArticleLike,
  Comment,
  CommentSub
]

const entity = TypeOrmModule.forFeature(table);

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...configService.get('db').mysql,
        entities: table
      }),
      inject: [ConfigService],
    }),
    entity
  ],
  providers: [DbService],
  exports: [DbService, entity],
})
export class DbModule {}