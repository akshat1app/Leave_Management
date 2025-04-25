import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/models/user.model';
import { OtpModule } from 'src/otp/otp.module';
import { CommonModule } from 'src/common/common.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    OtpModule,
    PassportModule,
    CommonModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const Jwt_Secret = configService.get<string>('JWT_SECRET');

        return {
          global: true,
          signOptions: { expiresIn: '1d' },
          secret: Jwt_Secret,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
