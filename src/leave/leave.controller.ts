import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { LeaveService } from './leave.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApplyLeaveDto } from './dto/apply-leave.dto';

@Controller('users/api/v1/leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async applyLeave(@Body() body: ApplyLeaveDto, @Req() req,) {
    const userId = req.user.userId;
    return this.leaveService.applyLeave(userId,body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getLeaves(@Query('type') type: string,@Query('page') page = 1,@Query('limit') limit = 10,@Req() req,) {
    const user = req.user;
    console.log(user);
    return this.leaveService.getLeaves(user.userId, type, +page, +limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':leaveId')
  async getLeave(@Param('leaveId') leaveId: string, @Req() req) {
    return this.leaveService.getLeaveById(req.user.userId, leaveId);
  }
}
