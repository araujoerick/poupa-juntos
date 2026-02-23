import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { ContributionStatus } from '@poupa-juntos/shared-types';
import { User } from './user.entity';
import { Group } from './group.entity';

@Entity('contributions')
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @Column()
  receiptUrl!: string;

  @Column({
    type: 'enum',
    enum: ContributionStatus,
    default: ContributionStatus.PENDING,
  })
  status!: ContributionStatus;

  @ManyToOne(() => User, (user) => user.contributions, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user!: Relation<User>;

  @Column()
  userId!: string;

  @ManyToOne(() => Group, (group) => group.contributions, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  group!: Relation<Group>;

  @Column()
  groupId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
