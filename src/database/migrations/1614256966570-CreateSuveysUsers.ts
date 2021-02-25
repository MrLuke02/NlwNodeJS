import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSuveysUsers1614256966570 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "surveys_users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "userId",
                        type: "uuid",
                    },
                    {
                        name: "surveyId",
                        type: "uuid"
                    },
                    {
                        name: "value",
                        type: "number",
                        isNullable: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    }
                ],
                foreignKeys: [
                    {
                        name: "FKuser",
                        referencedTableName: "Users",
                        referencedColumnNames: ["id"],
                        columnNames: ["userId"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE "
                    },
                    {
                        name: "FKsurvey",
                        referencedTableName: "Surveys",
                        referencedColumnNames: ["id"],
                        columnNames: ["surveyId"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE "
                    }
                ]
            })
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("surveys_users");
    }

}
