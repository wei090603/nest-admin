import { Controller } from "@nestjs/common";
import { Links } from '@libs/db/entity/links.entity';
import { LinksService } from './links.service';
import { Crud, CrudController } from "@nestjsx/crud";
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateLinksDto } from "./dto";

@Crud({
  model: {
    type: CreateLinksDto,
  },
  query: {
    limit: 10
  },
  serialize: {
    get: false,
    create: false,
    delete: false
  },
})
@ApiTags('友链管理')
@ApiBearerAuth()
@Controller("links")
export class LinksController implements CrudController<Links> {
  constructor(public service: LinksService) {}
}

