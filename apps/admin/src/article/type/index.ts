import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from "class-validator";
import { Tag } from "@libs/db/entity/tag.entity";
import { PageOptionsDto } from "apps/shared/dto/page.dto";

export class ArticleInfo {
  @ApiProperty({
    description: '文章标题',
  })
  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '标题不能为空' })
  readonly title: string;

  @ApiProperty({
    description: '分类',
  })
  @IsNumber({}, { message: '不是有效的数据' })
  readonly type: number;

  @ApiProperty({
    description: '文章内容',
  })
  @IsString({ message: '不是有效的数据' })
  @IsNotEmpty({ message: '分类名不能为空' })
  readonly content: string;

  @ApiProperty({
    description: '文章权限',
    example: 1,
  })
  readonly status: number;

  @ApiProperty({
    description: '帖子标签',
    example: [],
  })
  readonly tag: Tag[];
}

export class CreateArticleDto extends ArticleInfo {}

export class FindArticleDto extends PageOptionsDto { 
  @ApiProperty({
    description: '文章名称',
    required: false,
  })
  @IsOptional()
  readonly title: string;
}


// response
export class PageArticleList {
  @ApiProperty({
    description: '列表',
    type: [PageArticleList]
  })
  list: ArticleInfo[]

  @ApiProperty({
    description: '总数',
  })
  total: number;
}