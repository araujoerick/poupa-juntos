import { MigrationInterface, QueryRunner } from 'typeorm';

export class GroupAsGoal1740200000000 implements MigrationInterface {
  name = 'GroupAsGoal1740200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "groups" ADD "target_amount" numeric(12,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" ADD "deadline" date`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "goals" CASCADE`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."goals_status_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "groups" DROP COLUMN IF EXISTS "target_amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" DROP COLUMN IF EXISTS "deadline"`,
    );
  }
}
