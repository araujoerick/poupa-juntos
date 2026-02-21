import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from '../entities/goal.entity.js';
import { Group } from '../entities/group.entity.js';
import { User } from '../entities/user.entity.js';
import { GoalService } from './goal.service.js';
import { GoalController } from './goal.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, Group, User])],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
