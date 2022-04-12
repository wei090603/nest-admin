import { Controller } from '@nestjs/common';
import { UserTagService } from './user-tag.service';

@Controller('user-tag')
export class UserTagController {
  constructor(private readonly userTagService: UserTagService) {}
}
