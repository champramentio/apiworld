import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Shorteneds extends BaseSchema {
	protected tableName = 'shortened'

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('shortened_id')
			table.string("shortened_original_link", 500).unique();
			table.string("shortened_hash", 10).unique();
			table.string("shortened_ip", 255);
			table.integer("shortened_total_clicked").unsigned().defaultTo(0);

			/**
			 * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
			 */
			table.timestamp('created_at', { useTz: true })
			table.timestamp('updated_at', { useTz: true })
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
