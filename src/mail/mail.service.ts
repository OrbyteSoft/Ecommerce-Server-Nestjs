import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BrevoClient } from '@getbrevo/brevo';
import { otpTemplate } from './templates/otp.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly brevo: BrevoClient;
  private readonly senderEmail: string;
  private readonly senderName: string;

  constructor() {
    const apiKey = (process.env.BREVO_API_KEY || '').trim();
    this.senderEmail = (process.env.BREVO_SENDER_EMAIL || '').trim();
    this.senderName = (process.env.BREVO_SENDER_NAME || 'JustClick').trim();

    this.brevo = new BrevoClient({
      apiKey,
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    try {
      const response = await this.brevo.transactionalEmails.sendTransacEmail({
        subject: 'Your OTP Verification Code',
        htmlContent: otpTemplate(otp),
        textContent: `Your verification code is ${otp}. It expires in 10 minutes.`,
        sender: {
          email: this.senderEmail,
          name: this.senderName,
        },
        to: [{ email }],
      });

      const responseData = (response as any)?.data ?? response;
      const messageId =
        responseData?.messageId ?? responseData?.messageIds?.[0] ?? 'unknown';
      this.logger.log(
        `Brevo accepted OTP email to ${email} with messageId=${messageId}`,
      );
    } catch (error: any) {
      const status = error?.statusCode ?? error?.status ?? 'unknown';
      const body = error?.body ? ` Body: ${JSON.stringify(error.body)}` : '';
      throw new InternalServerErrorException(
        `Failed to send email: ${error?.message ?? 'Unknown email error'} (status: ${status})${body}`,
      );
    }
  }
}
