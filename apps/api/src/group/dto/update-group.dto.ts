import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGroupDto {
  @ApiPropertyOptional({ example: 'Viagem para o Japão 🇯🇵' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 6000, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  targetAmount?: number | null;

  @ApiPropertyOptional({ example: '2025-12-31', nullable: true })
  @IsOptional()
  @IsDateString()
  deadline?: string | null;
}
