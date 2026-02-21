import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Contribution } from '../entities/contribution.entity.js';
import { Group } from '../entities/group.entity.js';
import { User } from '../entities/user.entity.js';
import { ContributionService } from './contribution.service.js';
import { ContributionController } from './contribution.controller.js';
import { ContributionsGateway } from './contributions.gateway.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contribution, Group, User]),
    MulterModule.register({
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    }),
  ],
  controllers: [ContributionController],
  providers: [ContributionService, ContributionsGateway],
  exports: [ContributionsGateway],
})
export class ContributionModule {}
