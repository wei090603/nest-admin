import { Module } from '@nestjs/common';
import { IptoaddressService } from './iptoaddress.service';

@Module({
  providers: [IptoaddressService],
  exports: [IptoaddressService],
})
export class IptoaddressModule {}
