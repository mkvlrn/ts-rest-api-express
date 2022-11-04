import { IsDefined, IsEmail, IsString, Length } from 'class-validator';

export class UserInputDto {
  @IsEmail()
  @IsDefined()
  email!: string;

  @Length(6)
  @IsString()
  @IsDefined()
  password!: string;
}
