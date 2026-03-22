import { BadRequestException, Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

interface OtpRecord {
  otp: string;
  expiresAt: Date;
  attempts: number;
}

@Injectable()
export class OtpService {
  // For production, move this store to Redis.
  private readonly otpStore = new Map<string, OtpRecord>();
  private readonly MAX_ATTEMPTS = 3;
  private readonly OTP_EXPIRY_MS = 10 * 60 * 1000;

  constructor(private readonly mailService: MailService) {}

  async sendOtp(email: string): Promise<void> {
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MS);

    this.otpStore.set(email, { otp, expiresAt, attempts: 0 });
    await this.mailService.sendOtp(email, otp);
  }

  verifyOtp(email: string, otp: string): boolean {
    const record = this.otpStore.get(email);

    if (!record) {
      throw new BadRequestException('OTP not found. Please request a new one.');
    }

    if (new Date() > record.expiresAt) {
      this.otpStore.delete(email);
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    if (record.attempts >= this.MAX_ATTEMPTS) {
      this.otpStore.delete(email);
      throw new BadRequestException('Too many attempts. Please request a new OTP.');
    }

    if (record.otp !== otp) {
      record.attempts++;
      throw new BadRequestException(
        `Invalid OTP. ${this.MAX_ATTEMPTS - record.attempts} attempts remaining.`,
      );
    }

    this.otpStore.delete(email);
    return true;
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
