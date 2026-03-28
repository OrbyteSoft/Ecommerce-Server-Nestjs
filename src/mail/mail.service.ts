import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Resend } from 'resend';
import { otpTemplate } from './templates/otp.template';

@Injectable()
export class MailService {
  private readonly resend: Resend | null;
  private readonly fromAddress: string;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not set — email sending disabled');
    }

    this.resend = apiKey ? new Resend(apiKey) : null;
    this.fromAddress =
      process.env.RESEND_FROM ?? 'Just Click <onboarding@resend.dev>';
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    if (!this.resend) {
      this.logger.error('Attempted to send OTP but Resend is not configured');
      throw new InternalServerErrorException('Email service is not configured');
    }

    try {
      await this.resend.emails.send({
        from: this.fromAddress,
        to: email,
        subject: 'Your OTP Verification Code',
        html: otpTemplate(otp),
      });
    } catch (err) {
      this.logger.error('Failed to send OTP', err as Error);
      throw new InternalServerErrorException('Failed to send OTP');
    }
  }
}
