import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from '../entities/contribution.entity';
import { Group } from '../entities/group.entity';
import { WorkerService } from './worker.service';
import { GeminiModule } from '../gemini/gemini.module';
import { ContributionModule } from '../contribution/contribution.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contribution, Group]),
    GeminiModule,
    ContributionModule,
  ],
  providers: [WorkerService],
})
export class WorkerModule {}
