import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserService } from "./user.service";
import { Body, Controller, Get, Patch, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

@UseGuards(JwtAuthGuard)
@Controller('users/api/v1/profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiBearerAuth()
  getProfile(@Req() req: any) {
    return this.userService.getProfile(req.user.userId);
  }

  @Patch()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('profilePic')) 
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updateProfile(req.user.userId, dto, file); 
  }
}
