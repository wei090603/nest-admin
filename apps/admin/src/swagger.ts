import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


export function setupSwagger(app: INestApplication): void {

  const swaggerConfig = new DocumentBuilder()
    .setTitle('后台管理系统')
    .setDescription('后台管理系统API接口文档')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth()
    .setLicense('MIT', 'https://github.com/buqiyuan/nest-admin')
    // JWT鉴权
    // .addSecurity('admin', {
    //   description: '后台管理接口授权',
    //   type: 'apiKey',
    //   in: 'header',
    //   name: 'Authorization',
    // })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
