import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { GoalStatus } from '@poupa-juntos/shared-types';
import { Group } from './group.entity.js';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  targetAmount!: number;

  @Column({ type: 'date' })
  deadline!: string;

  @Column({
    type: 'enum',
    enum: GoalStatus,
    default: GoalStatus.ACTIVE,
  })
  status!: GoalStatus;

  @ManyToOne(() => Group, (group) => group.goals, {
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

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
