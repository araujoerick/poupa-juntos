import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { getAuth } from '@clerk/express';
import type { Request } from 'express';
import { GroupService } from './group.service.js';
import { CreateGroupDto } from './dto/create-group.dto.js';

@ApiBearerAuth()
@ApiTags('groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body() dto: CreateGroupDto, @Req() req: Request) {
    const { userId } = getAuth(req);
    return this.groupService.create(dto, userId!);
  }

  @Get()
  findAll(@Req() req: Request) {
    const { userId } = getAuth(req);
    return this.groupService.findAllForUser(userId!);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const { userId } = getAuth(req);
    return this.groupService.findOne(id, userId!);
  }

  @Post('join/:inviteHash')
  join(@Param('inviteHash') inviteHash: string, @Req() req: Request) {
    const { userId } = getAuth(req);
    return this.groupService.join(inviteHash, userId!);
  }
}
