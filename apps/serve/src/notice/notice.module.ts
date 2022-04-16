import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeGateway } from './notice.gateway';

@Module({
  providers: [NoticeGateway, NoticeService]
})
export class NoticeModule {}
