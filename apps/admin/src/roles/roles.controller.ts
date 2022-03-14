import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CommonRoles, FindRolesDto } from './dto';
import { PageRolesList } from './res';
import { RolesService } from './roles.service';

@ApiTags('角色管理')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOkResponse({ type: [PageRolesList] })
  @ApiOperation({ summary: '获取角色列表' })
  async findAll(@Query() query: FindRolesDto) {
    return await this.rolesService.findAll(query);
  }

  @Get('list')
  @ApiOkResponse({ type: [CommonRoles] })
  @ApiOperation({ summary: '获取角色列表-无分页' })
  async list() {
    return await this.rolesService.list();
  }

  @Post()
  @ApiOperation({ summary: '添加角色' })
  async register(@Body() data: CommonRoles) {
    return this.rolesService.create(data);
  }
}
