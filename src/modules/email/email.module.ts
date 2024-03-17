import { Global, Module } from '@nestjs/common';
import { MailingService } from './email.service';

@Global()
@Module({
  providers: [MailingService],
  exports: [MailingService],
})
export class EmailModule {}
