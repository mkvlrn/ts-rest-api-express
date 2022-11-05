import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsDefined()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
