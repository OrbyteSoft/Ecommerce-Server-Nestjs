import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly apiUrl = 'http://api.sparrowsms.com/v2/sms/';

  private normalizeNepaliPhone(phone: string): string {
    const raw = phone.trim();

    if (/^(98|97)\d{8}$/.test(raw)) {
      return raw;
    }

    if (/^\+9779\d{9}$/.test(raw)) {
      return raw.slice(4);
    }

    if (/^9779\d{9}$/.test(raw)) {
      return raw.slice(3);
    }

    return raw;
  }

  async sendOtp(phone: string, otp: string): Promise<void> {
    try {
      const normalizedPhone = this.normalizeNepaliPhone(phone);

      const response = await axios.get(this.apiUrl, {
        params: {
          token: process.env.SPARROW_SMS_TOKEN,
          from: process.env.SPARROW_SMS_FROM,
          to: normalizedPhone,
          text: `Your verification code is: ${otp}. Valid for 10 minutes. Do not share it with anyone.`,
        },
      });

      if (response.data?.response_code !== 200) {
        throw new Error(response.data?.response || 'Unknown error');
      }
    } catch (error: any) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.response || error.message
        : error.message;
      throw new InternalServerErrorException(
        `Failed to send SMS: ${message}`,
      );
    }
  }
}
