import { ApiProperty } from "@nestjs/swagger";

export class Token {
  @ApiProperty({ description: 'token' })
  token: string;
}
