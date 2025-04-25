import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsEmail() 
  email: string;

  @IsString() 
  name: string;
  
  @IsNotEmpty()
  @MinLength(6) 
  password: string;

  profilePicUrl?: string;
}
