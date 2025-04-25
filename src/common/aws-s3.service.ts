import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Service {
  private s3: S3Client;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION')!,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY')!,
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY')!,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const key = `${folder}/${uuid()}-${file.originalname}`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `https://${this.configService.get<string>(
      'AWS_S3_BUCKET',
    )}.s3.${this.configService.get<string>(
      'AWS_REGION',
    )}.amazonaws.com/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
        Key: key,
      }),
    );
  }
}
