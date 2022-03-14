import { ApiProperty } from "@nestjs/swagger";
import { CommonRoles } from "../dto";


export class PageRolesList {
  @ApiProperty({
    description: '总数',
    type: [CommonRoles]
  })
  list: CommonRoles[]

  @ApiProperty({
    description: '总数',
  })
  total: number;
}
