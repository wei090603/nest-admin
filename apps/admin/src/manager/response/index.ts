import { ApiProperty } from "@nestjs/swagger";
import { CommonManager } from "../dto";

export class ManagerList extends CommonManager {
  @ApiProperty({
    description: '角色',
    example: ['超级管理员', '测试'],
  })
  readonly roles: number[];

}

export class PageManagerList {
  @ApiProperty({
    description: '总数',
    type: [ManagerList]
  })
  list: ManagerList[]

  @ApiProperty({
    description: '总数',
  })
  total: number;
}