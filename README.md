## Description

[后台管理系统地址](https://admin.tobtt.cn)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

# Monorepo 模式

# orm

\$ 一对多 多对一 一定要存实体否则关系不存在

# 创建一个子服务

\$ nest g app name

# 启动子项代码命令

\$ nest start -w admin

# 创建公用模块

$ nest g lib db
$ nest g lib common

# hat prefix would you like to use for the library (default: @app)? 你要使用什么前缀 @libs

# 一次生成模块

\$ nest g res -p admin 模块名
$ --no-spec 不添加测试文件

# 项目 依赖升级

yarn upgrade-interactive --latest

# 打包

nest build 项目名 admin
