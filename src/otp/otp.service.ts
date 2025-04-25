import {
    BadRequestException,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { RedisService } from '../redis/redis.service';
  import { MailerService } from '../mailer/mailer.service';
  
  @Injectable()
  export class OtpService {
    constructor(
      private redisService: RedisService,
      private mailerService: MailerService,
    ) {}

  
    private generateOtp(): string {
      return Math.floor(100000 + Math.random() * 900000).toString();
    }
  
    async sendOtp(email: string, context: 'verify' | 'reset') {
      const otp = this.generateOtp();
      const otpKey = `otp:${context}:${email}`;
      const attemptsKey = `otp:attempts:${context}:${email}`;
  
      await this.redisService.set(otpKey, otp, 5 * 60 * 1000);
      await this.redisService.set(attemptsKey, '0', 5 * 60 * 1000);
      await this.mailerService.sendMail(
        email,
        'Your OTP Code',
        `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      );
    }
  
    async verifyOtp(email: string, submittedOtp: string, context: 'verify' | 'reset') {
      const otpKey = `otp:${context}:${email}`;
      const attemptsKey = `otp:attempts:${context}:${email}`;
  
      const storedOtp = await this.redisService.get(otpKey);
      if (!storedOtp) throw new BadRequestException('OTP expired or not found');
  
      const attempts = parseInt(await this.redisService.get(attemptsKey) || '0');
      if (attempts >= 5) {
        throw new ForbiddenException('Too many incorrect attempts. Try again later.');
      }
  
      if (storedOtp !== submittedOtp) {
        await this.redisService.set(attemptsKey, (attempts + 1).toString(), 5 * 60 * 1000);
        throw new BadRequestException('Invalid OTP');
      }
  
      await this.redisService.del(otpKey);
      await this.redisService.del(attemptsKey);
    }
  }
  