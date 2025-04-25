import { Controller, Post, Body, UseGuards, Get, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { OtpDto } from './dto/otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/common/aws-s3.service';

@Controller('users/api/v1')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly s3Service: AwsS3Service,
  ) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('profilePic'))
  async signup(@Body() dto: SignupDto,@UploadedFile() file:Express.Multer.File) {
    let profilePicUrl: string | null = null;
    if (file) {
      profilePicUrl = await this.s3Service.uploadFile(file, 'profile-pics');
      console.log(profilePicUrl);
    }
    return this.authService.signup(dto, profilePicUrl);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: OtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forget-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('send-otp')
  sendOtp(@Body() dto: ForgotPasswordDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

}
