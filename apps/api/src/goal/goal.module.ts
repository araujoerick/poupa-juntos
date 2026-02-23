import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from '../entities/goal.entity';
import { Group } from '../entities/group.entity';
import { User } from '../entities/user.entity';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, Group, User])],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
