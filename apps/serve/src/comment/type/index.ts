import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({
    description: '评论文章id',
    example: 1,
  })
  @IsNotEmpty({ message: '评论文章不能为空' })
  readonly articleId: number;

  @ApiProperty({
    description: '评论内容',
  })
  @IsString({ message: '评论内容有效的数据' })
  @IsNotEmpty({ message: '评论内容不能为空' })
  readonly content: string;
}

export class CreateCommenSubtDto {
  @ApiProperty({
    description: '评论内容',
  })
  @IsString({ message: '评论内容有效的数据' })
  @IsNotEmpty({ message: '评论内容不能为空' })
  readonly content: string;

  @ApiProperty({
    description: '评论父级id',
    example: null
  })
  @IsOptional()
  readonly parentId: number;

  @ApiProperty({
    description: '回复用户ID',
    example: null,
    required: false
  })
  @IsOptional()
  replyId?: number
}
