import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';


@Schema({ timestamps: true })
export class User extends Document {
  
  @Prop({ required: true }) 
  name: string;

  @Prop({ required: true, unique: true }) 
  email: string;

  @Prop({ required: true }) 
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop() 
  profilePicture: string;

  @Prop({ default: 6 }) 
  totalLeaves: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
