/*
 * @Description: 
 * @Author: tao.wei
 * @Date: 2021-09-18 16:27:24
 */
import {
  IsNotEmpty,
  IsEmail,
  IsMobilePhone,
  IsString,
  MinLength,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateUserDto {
  
  @ApiProperty({
    description: '昵称',
  })
  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '昵称不能为空' })
  @MinLength(2, { message: '昵称至少需要两位' })
  readonly nickName: string;

  // @ApiProperty({
  //   description: '帐号',
  //   uniqueItems: true, // 唯一
  // })
  // @IsString({ message: '用户名不是有效的数据' })
  // @IsNotEmpty({ message: '用户名不能为空' })
  // @MinLength(6, { message: '用户名至少需要六位' })
  // readonly account: string;

  @ApiProperty({
    description: '头像',
  })
  readonly avatar: string;

  @ApiProperty({ description: '年龄', example: 20 })
  @IsNumber()
  readonly age: number;

  @ApiProperty({ description: '性别 1-true女 2-false男', example: true })
  @IsBoolean()
  readonly sex: boolean;
  
  @ApiProperty({
    description: '是否允许获取位置',
    example: true
  })
  readonly position: boolean;

  @ApiProperty({
    description: '当前位置',
  })
  readonly location: string;
    
}
