import { Module } from '@nestjs/common';
import { AutoreplyService } from './autoreply.service';
import { FocuspacksModule } from '../focuspacks/focuspacks.module';

@Module({
  imports: [FocuspacksModule],
  providers: [AutoreplyService],
  exports: [AutoreplyService],
})
export class AutoreplyModule {}
