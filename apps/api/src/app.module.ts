import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { clerkMiddleware } from '@clerk/express';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { User, Group, Goal, Contribution } from './entities/index.js';
import { AuthModule } from './auth/auth.module.js';
import { GroupModule } from './group/group.module.js';
import { GoalModule } from './goal/goal.module.js';
import { HealthModule } from './health/health.module.js';
import { ContributionModule } from './contribution/contribution.module.js';
import { WorkerModule } from './worker/worker.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.getOrThrow<number>('DB_PORT'),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
        entities: [User, Group, Goal, Contribution],
        migrations: ['dist/migrations/*.js'],
        synchronize: false,
        logging: config.get('NODE_ENV') !== 'production',
      }),
    }),
    AuthModule,
    GroupModule,
    GoalModule,
    HealthModule,
    ContributionModule,
    WorkerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(clerkMiddleware()).forRoutes('*');
  }
}
