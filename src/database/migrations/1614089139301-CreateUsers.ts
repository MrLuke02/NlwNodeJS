import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { idText } from "typescript";

export class CreateUsers1614089139301 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "name",
                        type: "varChar",
                    },
                    {
                        name: "email",
                        type: "varChar"
                    },
                    {
                        name: "created_at",
                        type: "timesStamp",
                        default: "now()"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }

}
