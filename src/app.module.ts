import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';
import { MailerModule } from './mailer/mailer.module';
import { OtpModule } from './otp/otp.module';
import { LeaveModule } from './leave/leave.module';
import { AwsS3Service } from './common/aws-s3.service';
import { RequestLoggerMiddleware } from './logger/logger.middleware';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '/home/user/NodeJs /Nest Framework/leave-management/bin/env.local',
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => {
        return {uri: configService.get<string>("MONGO_URI")}
      }
    }),
    RedisModule,
    UserModule,
    MailerModule,
    OtpModule,
    LeaveModule
  ],
  controllers: [AppController],
  providers: [AppService,AwsS3Service],
  exports: [AwsS3Service]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
