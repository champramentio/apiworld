import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class ShortenedDetail extends BaseSchema {
	protected tableName = "shortened_detail";

	public async up() {
		this.schema.createTable(this.tableName, table => {
			table.increments("id");
			table.timestamp("created_at", { useTz: true });
			table.string("user_agent", 500);
			table.string("client_ip", 20);

			/**
			 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
			 */

			table.integer("shortened_id").unsigned().references("shortened_id").inTable("shortened").onDelete("CASCADE");
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
