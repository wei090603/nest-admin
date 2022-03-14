import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FindManagerDto, CreateManagerDto } from './dto';
import { PageManagerList } from './response';
import { ManagerService } from './manager.service';

@ApiTags('后台用户管理')
@ApiBearerAuth()
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get()
  @ApiOkResponse({ type: [PageManagerList] })
  @ApiOperation({ summary: '获取管理员列表' })
  async findAll(@Query() query: FindManagerDto) {
    return await this.managerService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: '添加管理员' })
  async create(@Body() data: CreateManagerDto) {
    return this.managerService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: '修改用户信息' })
  async updateInfo(@Param('id') id: string, @Body() data: CreateManagerDto) {
    return await this.managerService.updated(+id, data);
  }

  @Patch('restPassword/:id')
  @ApiOperation({ summary: '重置用户密码' })
  async restPassword(@Param('id') id: string) {
    return await this.managerService.restPassword(+id);
  }

  @Patch('status/:id')
  @ApiOperation({ summary: '修改用户状态' })
  async updateStatus(@Param('id') id: string) {
    return this.managerService.updateStatus(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户', description: '删除用户' })
  async remove(@Param('id') id: string) {
    return await this.managerService.remove(+id);
  }
}
