import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class ApplyLeaveDto {
  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsString()
  leaveType: string;

  @IsNotEmpty()
  @IsString()
  reason: string;
}
