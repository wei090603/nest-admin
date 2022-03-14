import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LoginLoggerService } from './login-logger.service';
import { PageLoginLoggerList, FindLoginLoggerDto } from './type';


@ApiTags('登录日志管理')
@ApiBearerAuth()
@Controller('login-logger')
export class LoginLoggerController {
  constructor(private readonly loginLoggerService: LoginLoggerService) {}

  @Get()
  @ApiOkResponse({ type: [PageLoginLoggerList] })
  @ApiOperation({ summary: '获取标签列表' })
  async findAll(@Query() query: FindLoginLoggerDto) {
    return await this.loginLoggerService.findAll(query);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除标签', description: '删除标签' })
  async remove(@Param('id') id: string) {
    return await this.loginLoggerService.remove(+id);
  }

}
