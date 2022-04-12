import { Module } from '@nestjs/common';
import { UserTagService } from './user-tag.service';
import { UserTagController } from './user-tag.controller';

@Module({
  controllers: [UserTagController],
  providers: [UserTagService]
})
export class UserTagModule {}
