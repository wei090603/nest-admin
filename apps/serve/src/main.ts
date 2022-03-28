import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import { setupSwagger } from './swagger';
import { ApiExceptionFilter } from 'apps/shared/filters/api-exception.filter';
import { ApiTransformInterceptor } from 'apps/shared/interceptor/api-interceptor';
import rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';
import { ServeModule } from './serve.module';
import { ValidationPipe } from 'apps/shared/pipes/validation.pipe';
import * as http from "http";
import * as https from "https";
import * as express from 'express';
import { join } from 'path';

const httpsOptions = {
  key: fs.readFileSync(join(process.cwd(), './config/7508667_lhapi.tobtt.cn.key')),
  cert: fs.readFileSync(join(process.cwd(), './config/7508667_lhapi.tobtt.cn.pem')),
};

async function bootstrap() {
  const server = express();
  
  // 设置cors允许跨域访问
  const app = await NestFactory.create<NestExpressApplication>(ServeModule, {
    cors: true,
    bufferLogs: true,
    logger: ['log', 'error', 'warn'],
  });
  const config = app.get<ConfigService>(ConfigService);

  // 配置 文件夹为静态目录，以达到可直接访问下面文件的目的
  app.useStaticAssets('uploads', {
    prefix: '/uploads'
  })

  // 访问频率
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 500, // 限制15分钟内最多只能访问500次
    }),
  );
  // 日志
  // app.useLogger(app.get(Logger));
  // 异常接管，统一异常返回数据
  app.useGlobalFilters(new ApiExceptionFilter());
  // // 统一处理返回接口结果，如果不需要则添加
  app.useGlobalInterceptors(new ApiTransformInterceptor(new Reflector()));
  // 设置一个全局作用域的管道
  app.useGlobalPipes(new ValidationPipe());
  
  setupSwagger(app);

  const { servePort } = config.get('http');
  await app.init();

  http.createServer(server).listen(servePort);
  https.createServer(httpsOptions, server).listen(443);
  Logger.log(`http://localhost:${servePort}/swagger`,'服务器启动成功');
}

bootstrap();
