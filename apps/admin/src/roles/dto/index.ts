import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, MinLength } from "class-validator";
import { PageOptionsDto } from "apps/shared/dto/page.dto";


export class CommonRoles {
  @ApiProperty({
    description: '角色名',
  })
  @IsString({ message: '不是有效的数据' })
  @MinLength(2, { message: '角色名至少需要2位' })
  readonly roleName: string;

  @ApiProperty({
    description: '角色标识',
  })
  @IsString({ message: '不是有效的数据' })
  @MinLength(2, { message: '角色标识至少需要2位' })
  readonly mark: string;

  @ApiProperty({
    description: '描述',
    required: false,
    example: ''
  })
  @IsString({ message: '不是有效的数据' })
  readonly remark: string;

}

export class FindRolesDto extends PageOptionsDto {
  @ApiProperty({
    description: '角色名',
    required: false,
    example: ''
  })
  @IsOptional()
  readonly roleName: string;
}

export class ResourcesDto {
  @ApiProperty({ description: '资源id', example: [1] })
  @IsArray({ message: '资源id不是有效的数据' })
  readonly resourcesId: Number[];
}

export class UpdateRoleDto extends PartialType(CommonRoles) {}