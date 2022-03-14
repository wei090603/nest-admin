import { ApiProperty } from "@nestjs/swagger";
import { AdvertiseInfo } from "../dto";

export class PageAdvertiseList {
  @ApiProperty({
    description: '总数',
    type: [AdvertiseInfo]
  })
  list: AdvertiseInfo[]

  @ApiProperty({
    description: '总数',
  })
  total: number;
}