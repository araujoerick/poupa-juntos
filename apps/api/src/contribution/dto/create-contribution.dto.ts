import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsUUID, Max } from 'class-validator';

export class CreateContributionDto {
  @ApiProperty({ example: 250.0, description: 'Valor do aporte em reais' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(999999999999.99)
  amount!: number;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsUUID()
  groupId!: string;
}
