import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from '../entities/contribution.entity.js';
import { Group } from '../entities/group.entity.js';
import { WorkerService } from './worker.service.js';
import { GeminiModule } from '../gemini/gemini.module.js';
import { ContributionModule } from '../contribution/contribution.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contribution, Group]),
    GeminiModule,
    ContributionModule,
  ],
  providers: [WorkerService],
})
export class WorkerModule {}
