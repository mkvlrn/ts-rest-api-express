import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class GetManyDto {
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page?: number;
}
