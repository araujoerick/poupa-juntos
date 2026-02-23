import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from '../entities/goal.entity';
import { Group } from '../entities/group.entity';
import { User } from '../entities/user.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalService {
  private readonly logger = new Logger(GoalService.name);

  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    groupId: string,
    dto: CreateGoalDto,
    clerkId: string,
  ): Promise<Goal> {
    await this.assertGroupMember(groupId, clerkId);

    if (new Date(dto.deadline) <= new Date()) {
      throw new BadRequestException('Deadline must be in the future');
    }

    const goal = this.goalRepository.create({
      ...dto,
      groupId,
    });

    const saved = await this.goalRepository.save(goal);
    this.logger.log({ event: 'goal.created', entityId: saved.id });
    return saved;
  }

  async findAllForGroup(groupId: string, clerkId: string): Promise<Goal[]> {
    await this.assertGroupMember(groupId, clerkId);
    return this.goalRepository.find({
      where: { groupId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, clerkId: string): Promise<Goal> {
    const goal = await this.goalRepository.findOne({ where: { id } });
    if (!goal) throw new NotFoundException('Goal not found');
    await this.assertGroupMember(goal.groupId, clerkId);
    return goal;
  }

  async update(id: string, dto: UpdateGoalDto, clerkId: string): Promise<Goal> {
    const goal = await this.findOne(id, clerkId);

    if (dto.deadline && new Date(dto.deadline) <= new Date()) {
      throw new BadRequestException('Deadline must be in the future');
    }

    Object.assign(goal, dto);
    const saved = await this.goalRepository.save(goal);
    this.logger.log({ event: 'goal.updated', entityId: saved.id });
    return saved;
  }

  async remove(id: string, clerkId: string): Promise<void> {
    const goal = await this.findOne(id, clerkId);
    await this.goalRepository.softRemove(goal);
    this.logger.log({ event: 'goal.removed', entityId: id });
  }

  private async assertGroupMember(
    groupId: string,
    clerkId: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { clerkId } });
    if (!user) throw new NotFoundException('User not found');

    const group = await this.groupRepository
      .createQueryBuilder('group')
      .innerJoin('group.members', 'member', 'member.id = :userId', {
        userId: user.id,
      })
      .where('group.id = :groupId', { groupId })
      .andWhere('group.deletedAt IS NULL')
      .getOne();

    if (!group) throw new ForbiddenException('Access denied');
  }
}
