import { Global, Module, CacheModule } from '@nestjs/common';
import { CommonService } from './common.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Configuration from './config';
import * as path from 'path';
import { DbModule } from '@libs/db';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { MailerModule } from '@nestjs-modules/mailer';
import { diskStorage } from 'multer';
import { IptoaddressModule } from '@libs/iptoaddress';
import { EmailModule } from '@libs/email';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      ignoreEnvFile: true, // 忽略.env读取
      load: [Configuration],
      envFilePath: [] // 配置文件路径
    }),
    DbModule,
    PassportModule.register({ defaultStrategy: 'JWT' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => configService.get('jwt'),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        ...configService.get('redis')
      }),
      inject: [ConfigService],
    }),
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: path.join(process.cwd(), './uploads'),
          filename: (req, file, cb) => {
            // 在此处自定义保存后的文件名称
            const filename = `${Date.now() + Math.round(Math.random() * 1e9)}.${file.mimetype.split('/')[1]}`;
            return cb(null, filename);
          },
        }),
        limits: {
          fieldSize: 2000,
          field: 100
        },
        fileFilter (req: any, file: { mimetype: string }, cb: any) {
          const type = ['jpg', 'jpeg', 'png', 'gif'].map(v => `image/${v}`).find(v => v === file.mimetype);
          cb(null, type)
        }
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const { host, user, pass, from } = configService.get('email');
        return {
          transport: {
            host, //邮箱服务器地址
            port: 465,
            logger: false,
            debug: false,
            auth: {
              user,
              pass,
            },
          },
          preview: false,//是否开启预览，开启了这个属性，在调试模式下会自动打开一个网页，预览邮件
          defaults: {
            from,
          },
          template: {
            // dir: path.join(__dirname, './template'),
            dir: path.join(process.cwd(), './template'),
            adapter: new EjsAdapter(),
            options: {
              strict: true
            }
          }
        }
      },
      inject: [ConfigService],
    }),
    IptoaddressModule,
    EmailModule
  ],
  providers: [CommonService],
  exports: [CommonService, JwtModule, CacheModule, MulterModule, IptoaddressModule, EmailModule],
})

export class CommonModule {}
