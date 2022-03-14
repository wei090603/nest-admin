import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class LinksInfo {
  @ApiProperty({
    description: '标题',
  })
  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '友链标题不能为空' })
  readonly title: string;


  @ApiProperty({
    description: '地址',
  })
  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '友链地址不能为空' })
  readonly link: string;
  
  @ApiProperty({
    description: '排序',
    example: 255,
    required: false
  })
  @IsOptional()
  @IsNumber({maxDecimalPlaces: 255}, { message: '不是有效的数据' })
  readonly sort: number;
}


export class CreateLinksDto extends LinksInfo {

}