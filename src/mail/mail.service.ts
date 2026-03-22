import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';
import { otpTemplate } from './templates/otp.template';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly fromAddress: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromAddress =
      process.env.RESEND_FROM ?? 'Just Click <onboarding@resend.dev>';
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.fromAddress,
      to: email,
      subject: 'Your OTP Verification Code',
      html: otpTemplate(otp),
    });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to send OTP: ${error.message}`,
      );
    }
  }
}
