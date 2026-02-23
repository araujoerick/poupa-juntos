import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Group } from './group.entity';
import { Contribution } from './contribution.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  clerkId!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @ManyToMany(() => Group, (group) => group.members)
  groups!: Relation<Group[]>;

  @OneToMany(() => Contribution, (contribution) => contribution.user)
  contributions!: Relation<Contribution[]>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
