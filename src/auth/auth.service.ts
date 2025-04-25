import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/models/user.model';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { OtpDto } from './dto/otp.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Model } from 'mongoose';
import { OtpService } from 'src/otp/otp.service';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class AuthService {
  private readonly s3Client:S3Client;
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    private otpService: OtpService,
    private configService: ConfigService
  ) {
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>('AWS_S3_REGION'),
    });
  }

  async signup(dto: SignupDto,profilePicture: string | null) {
    const userExists = await this.userModel.findOne({ email: dto.email });
    if (userExists) throw new ConflictException('User already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      ...dto,
      profilePicture,
      isVerified: false,
      password: hashedPassword,
    });
    console.log(user);
    await this.otpService.sendOtp(dto.email, 'verify');
    return { message: 'Signup successful. OTP sent to email.' };
  }



  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user || !(await bcrypt.compare(dto.password, user.password)))
      throw new UnauthorizedException('Invalid credentials');

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first.');
    }    

    const token = this.jwtService.sign({ sub: user._id, email: user.email });
    return { message: 'Logged In Successfully', accessToken: token };
  }

  async verifyOtp(dto: OtpDto) {
    await this.otpService.verifyOtp(dto.email, dto.otp, 'verify');
    await this.userModel.updateOne({ email: dto.email }, { isVerified: true });

    return { message: 'Email verified successfully' };
  }



  async sendOtp(dto: ForgotPasswordDto) {
    await this.otpService.sendOtp(dto.email, 'reset');
    return { message: 'OTP sent' };
  }



  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new NotFoundException('User not found');
  
    await this.otpService.verifyOtp(dto.email, dto.otp, 'reset');
  
    if (!dto.newPassword) {
      throw new BadRequestException('New password is required');
    }
  
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  
    return { message: 'Password reset successful' };
  }
}