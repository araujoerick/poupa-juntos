import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Contribution } from '../entities/contribution.entity';
import { Group } from '../entities/group.entity';
import { User } from '../entities/user.entity';
import { ContributionService } from './contribution.service';
import { ContributionController } from './contribution.controller';
import { ContributionsGateway } from './contributions.gateway';

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
