import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { getAuth } from '@clerk/express';
import type { Request } from 'express';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@ApiBearerAuth()
@ApiTags('goals')
@Controller('groups/:groupId/goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  create(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Body() dto: CreateGoalDto,
    @Req() req: Request,
  ) {
    const { userId } = getAuth(req);
    return this.goalService.create(groupId, dto, userId!);
  }

  @Get()
  findAll(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Req() req: Request,
  ) {
    const { userId } = getAuth(req);
    return this.goalService.findAllForGroup(groupId, userId!);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const { userId } = getAuth(req);
    return this.goalService.findOne(id, userId!);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGoalDto,
    @Req() req: Request,
  ) {
    const { userId } = getAuth(req);
    return this.goalService.update(id, dto, userId!);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const { userId } = getAuth(req);
    return this.goalService.remove(id, userId!);
  }
}
