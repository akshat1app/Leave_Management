import { Module } from '@nestjs/common';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/models/user.model';
import { Leave, LeaveSchema } from './models/leave.model';

@Module({
  imports:[MongooseModule.forFeature([{
      name :User.name,
      schema: UserSchema 
     },{
    name :Leave.name,
    schema:LeaveSchema
  }
  ])],
  controllers: [LeaveController],
  providers: [LeaveService]
})
export class LeaveModule {}