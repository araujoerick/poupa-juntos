import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User, Group, Contribution } from './entities/index';
import { InitialSchema1740000000000 } from './migrations/1740000000000-InitialSchema';
import { GroupAsGoal1740200000000 } from './migrations/1740200000000-GroupAsGoal';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: Number(process.env['DB_PORT'] ?? 5432),
  username: process.env['DB_USERNAME'] ?? 'postgres',
  password: process.env['DB_PASSWORD'] ?? 'postgres',
  database: process.env['DB_NAME'] ?? 'poupa_juntos',
  entities: [User, Group, Contribution],
  migrations: [InitialSchema1740000000000, GroupAsGoal1740200000000],
  synchronize: false,
  logging: true,
});
