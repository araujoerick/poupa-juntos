import {
  IsString,
  IsNumber,
  IsPositive,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoalDto {
  @ApiProperty({ example: 'Passagens aéreas' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 5000.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  targetAmount!: number;

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString()
  deadline!: string;
}
