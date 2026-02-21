import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ example: 'Viagem para Europa 2025' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;
}
