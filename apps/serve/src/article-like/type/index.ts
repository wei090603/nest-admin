import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty } from "class-validator";

export class CreateArticleLikeDto {
  @ApiProperty({
    description: '帖子ID',
  })
  @IsNumber({}, {message: '数据类型不正确'} )
  @IsNotEmpty({ message: '帖子ID不能为空' })
  readonly articleId: number;
}
