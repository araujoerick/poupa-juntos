import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from './user.entity';
import { Contribution } from './contribution.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  inviteHash!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  pendingBalance!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  targetAmount!: number | null;

  @Column({ type: 'date', nullable: true })
  deadline!: string | null;

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable({
    name: 'group_members',
    joinColumn: { name: 'group_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  members!: Relation<User[]>;

  @OneToMany(() => Contribution, (contribution) => contribution.group, {
    cascade: true,
  })
  contributions!: Relation<Contribution[]>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
