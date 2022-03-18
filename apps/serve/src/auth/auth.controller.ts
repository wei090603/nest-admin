import { Controller, Get, Post, Req, UseGuards, Request} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { user } from 'apps/shared/decorators/user.decorator';
import { User } from '@libs/db/entity/user.entity';
import { JwtAuthGuard } from 'apps/shared/guards/guard.strategy';
import { LoginDto } from './type';

@ApiTags('登录管理')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: '用户登录', description: '用户登录' })
  // 根据策略名称 守卫进入不同策略
  @UseGuards(AuthGuard('local'))
  async login(@Request() request, @Req() req: { user: User }) {
    console.log(request.ip, 'req');
    return this.service.login(req.user);
  }

  @Get()
  @ApiOperation({ description: '返回当前用户登录信息', summary: '返回当前用户登录信息' })
  // 此接口需要传递token;
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  userInfo(@user() userInfo: User) {
    return { userInfo };
  }

  @Get('loginOut')
  @ApiOperation({
    description: '退出登录',
    summary: '退出登录',
  })
  // 此接口需要传递token;
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  loginOut() {
    return true;
  }
}
