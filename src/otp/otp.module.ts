import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { MailModule } from '../mail/mail.module';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [MailModule, SmsModule],
  providers: [OtpService],
  controllers: [OtpController],
})
export class OtpModule {}
