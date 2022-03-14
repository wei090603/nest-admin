/*
 * @Description: 
 * @Author: tao.wei
 * @Date: 2021-09-18 16:27:24
 */
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterCode {
  @ApiProperty({
    description: '邮箱',
    uniqueItems: true, // 唯一
  })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  readonly email: string;
}

export class CreateUserDto extends RegisterCode {
  @ApiProperty({
    description: '密码',
  })
  @MinLength(6, { message: '密码至少六位' })
  @IsString({ message: '密码不是有效的数据' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;

  @ApiProperty({
    description: '验证码',
  })
  @IsNotEmpty({ message: '验证码不能为空' })
  readonly code: string;
}
