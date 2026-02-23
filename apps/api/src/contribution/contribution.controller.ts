import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { getAuth } from '@clerk/express';
import type { Request } from 'express';
import { ContributionService } from './contribution.service';
import { CreateContributionDto } from './dto/create-contribution.dto';

@ApiBearerAuth()
@ApiTags('contributions')
@Controller('contributions')
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar comprovante de aporte' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('receipt'))
  create(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: CreateContributionDto,
    @Req() req: Request,
  ) {
    if (!file) throw new BadRequestException('Receipt file is required');
    const { userId } = getAuth(req);
    return this.contributionService.create(file, dto, userId!);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Listar aportes de um grupo' })
  findAllForGroup(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Req() req: Request,
  ) {
    const { userId } = getAuth(req);
    return this.contributionService.findAllForGroup(groupId, userId!);
  }
}
