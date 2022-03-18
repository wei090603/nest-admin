import { Tag } from "@libs/db/entity/tag.entity";
import { ApiProperty } from "@nestjs/swagger";
import { PageOptionsDto } from "apps/shared/dto/page.dto";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateArticleDto {
  @ApiProperty({
    description: '帖子标题',
  })
  @IsString({ message: '帖子标题不是有效的数据' })
  readonly title: string;

  @ApiProperty({
    description: '帖子内容',
  })
  @IsString({ message: '帖子内容不是有效的数据' })
  @IsNotEmpty({ message: '帖子内容不能为空' })
  readonly content: string;

  @ApiProperty({
    description: '帖子图片',
  })
  @IsString({ message: '帖子内容不是有效的数据' })
  @IsNotEmpty({ message: '帖子内容不能为空' })
  readonly images: string[];

  @ApiProperty({
    nullable: false,
    description: '帖子分类',
    example: 1,
  })
  readonly category: string;

  @ApiProperty({
    description: '帖子权限',
    example: 1,
  })
  readonly status: number;

  @ApiProperty({
    description: '帖子标签',
    example: [],
  })
  readonly tag: Tag[];

}


export class FindArticleDto extends PageOptionsDto {

  @ApiProperty({
    description: '分类',
    required: false,
    example: 2,
  })
  readonly categoryId: number;
}

export class SearchArticleDto extends PageOptionsDto {
  @ApiProperty({
    description: '文章标题',
    example: '',
    required: false,
  })
  @IsOptional()
  readonly title: string;
}