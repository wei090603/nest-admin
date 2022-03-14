import { ApiProperty } from "@nestjs/swagger";
import { TagInfo } from "../dto";

export class PageTagList {
  @ApiProperty({
    description: '总数',
    type: [TagInfo]
  })
  list: TagInfo[]

  @ApiProperty({
    description: '总数',
  })
  total: number;
}