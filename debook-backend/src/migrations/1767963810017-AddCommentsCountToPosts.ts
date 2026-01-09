import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCommentsCountToPosts1767963810017 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'posts',
      new TableColumn({
        name: 'comments_count',
        type: 'int',
        isNullable: false,
        default: 0,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('posts', 'comments_count');
  }
}
