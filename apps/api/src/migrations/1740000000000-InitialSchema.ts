import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1740000000000 implements MigrationInterface {
  name = 'InitialSchema1740000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."goals_status_enum" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."contributions_status_enum" AS ENUM ('PENDING', 'VALIDATED', 'REJECTED')
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"          uuid                NOT NULL DEFAULT uuid_generate_v4(),
        "clerkId"     character varying   NOT NULL,
        "email"       character varying   NOT NULL,
        "name"        character varying   NOT NULL,
        "createdAt"   TIMESTAMP           NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP           NOT NULL DEFAULT now(),
        "deletedAt"   TIMESTAMP,
        CONSTRAINT "UQ_users_clerkId" UNIQUE ("clerkId"),
        CONSTRAINT "UQ_users_email"   UNIQUE ("email"),
        CONSTRAINT "PK_users"        PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "groups" (
        "id"             uuid                     NOT NULL DEFAULT uuid_generate_v4(),
        "name"           character varying         NOT NULL,
        "inviteHash"     character varying         NOT NULL,
        "balance"        numeric(12,2)             NOT NULL DEFAULT '0',
        "pendingBalance" numeric(12,2)             NOT NULL DEFAULT '0',
        "createdAt"      TIMESTAMP                NOT NULL DEFAULT now(),
        "updatedAt"      TIMESTAMP                NOT NULL DEFAULT now(),
        "deletedAt"      TIMESTAMP,
        CONSTRAINT "UQ_groups_inviteHash" UNIQUE ("inviteHash"),
        CONSTRAINT "PK_groups"            PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "group_members" (
        "group_id" uuid NOT NULL,
        "user_id"  uuid NOT NULL,
        CONSTRAINT "PK_group_members" PRIMARY KEY ("group_id", "user_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "goals" (
        "id"           uuid                          NOT NULL DEFAULT uuid_generate_v4(),
        "name"         character varying              NOT NULL,
        "targetAmount" numeric(12,2)                 NOT NULL,
        "deadline"     date                          NOT NULL,
        "status"       "public"."goals_status_enum"  NOT NULL DEFAULT 'ACTIVE',
        "groupId"      uuid                          NOT NULL,
        "createdAt"    TIMESTAMP                     NOT NULL DEFAULT now(),
        "updatedAt"    TIMESTAMP                     NOT NULL DEFAULT now(),
        "deletedAt"    TIMESTAMP,
        CONSTRAINT "PK_goals" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "contributions" (
        "id"         uuid                                  NOT NULL DEFAULT uuid_generate_v4(),
        "amount"     numeric(12,2)                         NOT NULL,
        "receiptUrl" character varying                     NOT NULL,
        "status"     "public"."contributions_status_enum"  NOT NULL DEFAULT 'PENDING',
        "userId"     uuid                                  NOT NULL,
        "groupId"    uuid                                  NOT NULL,
        "createdAt"  TIMESTAMP                             NOT NULL DEFAULT now(),
        "updatedAt"  TIMESTAMP                             NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contributions" PRIMARY KEY ("id")
      )
    `);

    // Foreign keys
    await queryRunner.query(`
      ALTER TABLE "group_members"
        ADD CONSTRAINT "FK_group_members_group"
          FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE,
        ADD CONSTRAINT "FK_group_members_user"
          FOREIGN KEY ("user_id")  REFERENCES "users"("id")  ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "goals"
        ADD CONSTRAINT "FK_goals_group"
          FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "contributions"
        ADD CONSTRAINT "FK_contributions_user"
          FOREIGN KEY ("userId")  REFERENCES "users"("id")   ON DELETE CASCADE,
        ADD CONSTRAINT "FK_contributions_group"
          FOREIGN KEY ("groupId") REFERENCES "groups"("id")  ON DELETE CASCADE
    `);

    // uuid-ossp extension for uuid_generate_v4()
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contributions" DROP CONSTRAINT "FK_contributions_group"`);
    await queryRunner.query(`ALTER TABLE "contributions" DROP CONSTRAINT "FK_contributions_user"`);
    await queryRunner.query(`ALTER TABLE "goals"         DROP CONSTRAINT "FK_goals_group"`);
    await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_group_members_user"`);
    await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_group_members_group"`);
    await queryRunner.query(`DROP TABLE "contributions"`);
    await queryRunner.query(`DROP TABLE "goals"`);
    await queryRunner.query(`DROP TABLE "group_members"`);
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."contributions_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."goals_status_enum"`);
  }
}
