import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { PageOptionsDto } from "apps/shared/dto/page.dto";

export class CategoryInfo {
  @ApiProperty({
    description: '分类名',
    uniqueItems: true,
  })
  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '分类名不能为空' })
  readonly title: string;
}

export class CreateCategoryDto extends CategoryInfo {

}

export class FindCategoryDto extends PageOptionsDto { 
  @ApiProperty({
    description: '分类名',
    required: false,
  })
  @IsOptional()
  readonly name: string;
}


// response
export class PageCategoryList {
  @ApiProperty({
    description: '总数',
    type: [CategoryInfo]
  })
  list: CategoryInfo[]

  @ApiProperty({
    description: '总数',
  })
  total: number;
}