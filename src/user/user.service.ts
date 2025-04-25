import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { User } from "./models/user.model";
import { Model } from 'mongoose';
import { AwsS3Service } from "src/common/aws-s3.service";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly awsS3Service: AwsS3Service
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto, file?: Express.Multer.File) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('User not found');
    
    if (file) {
      if (user.profilePicture) {
        const oldFileKey = this.extractFileKeyFromUrl(user.profilePicture);
        await this.awsS3Service.deleteFile(oldFileKey);
      }

      const profilePicUrl = await this.awsS3Service.uploadFile(file, 'profile-pics');
      user.profilePicture = profilePicUrl;
    }
    user.name = dto.name;

    await user.save(); 
    return user;
}


  private extractFileKeyFromUrl(url: string): string {
    const regex = /https:\/\/[a-zA-Z0-9-]+\.s3\.[a-zA-Z0-9-]+\.amazonaws\.com\/(.+)/;
    const matches = url.match(regex);
    return matches ? matches[1] : '';
  }
}
