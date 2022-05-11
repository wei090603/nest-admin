import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'apps/shared/guards/roles.guard';
import { CreateMenuDto, FindMenuDto, MenuInfo } from './dto';
import { MenuService } from './menu.service';

@ApiTags('菜单管理')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOkResponse({ type: [MenuInfo] })
  @ApiOperation({ summary: '获取菜单列表-无分页' })
  async findAll(@Query() query: FindMenuDto) {
    return await this.menuService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: '添加菜单' })
  async create(@Body() data: CreateMenuDto) {
    return this.menuService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: '修改菜单信息' })
  async update(@Param('id') id: string, @Body() data: CreateMenuDto) {
    return await this.menuService.update(+id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单', description: '删除菜单' })
  async remove(@Param('id') id: string) {
    return await this.menuService.remove(+id);
  }
}
