import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../entities/group.entity';
import { User } from '../entities/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateGroupDto, clerkId: string): Promise<Group> {
    const user = await this.findOrFailUser(clerkId);

    const group = this.groupRepository.create({
      name: dto.name,
      inviteHash: crypto.randomUUID(),
      members: [user],
    });

    const saved = await this.groupRepository.save(group);
    this.logger.log({ event: 'group.created', entityId: saved.id });
    return saved;
  }

  async findAllForUser(clerkId: string): Promise<Group[]> {
    const user = await this.findOrFailUser(clerkId);
    return this.groupRepository
      .createQueryBuilder('group')
      .innerJoin('group.members', 'member', 'member.id = :userId', {
        userId: user.id,
      })
      .leftJoinAndSelect('group.members', 'members')
      .leftJoinAndSelect('group.goals', 'goals')
      .where('group.deletedAt IS NULL')
      .getMany();
  }

  async findOne(id: string, clerkId: string): Promise<Group> {
    const user = await this.findOrFailUser(clerkId);
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'members')
      .leftJoinAndSelect('group.goals', 'goals')
      .where('group.id = :id', { id })
      .andWhere('group.deletedAt IS NULL')
      .getOne();

    if (!group) throw new NotFoundException('Group not found');

    const isMember = group.members.some((m) => m.id === user.id);
    if (!isMember) throw new ForbiddenException('Access denied');

    return group;
  }

  async join(inviteHash: string, clerkId: string): Promise<Group> {
    const user = await this.findOrFailUser(clerkId);

    const group = await this.groupRepository.findOne({
      where: { inviteHash },
      relations: ['members'],
    });

    if (!group) throw new NotFoundException('Invalid invite link');

    const alreadyMember = group.members.some((m) => m.id === user.id);
    if (!alreadyMember) {
      group.members.push(user);
      await this.groupRepository.save(group);
      this.logger.log({ event: 'group.joined', entityId: group.id });
    }

    return group;
  }

  private async findOrFailUser(clerkId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { clerkId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
