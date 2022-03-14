import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Links } from "@libs/db/entity/links.entity";

@Injectable()
export class LinksService extends TypeOrmCrudService<Links> {
  constructor(@InjectRepository(Links) repo) {
    super(repo);
  }
}
