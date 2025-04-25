import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { RedisModule } from '../redis/redis.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [RedisModule, MailerModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
