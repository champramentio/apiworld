import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Shortened from "App/Models/Shortened";

export default class ShortenedDetail extends BaseModel {
	public static table = "shortened_detail";

	@column({ isPrimary: true })
	public id: number;

	@column() public clientIp: string;

	@column() public userAgent: string;

	@column() public shortenedId: number;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@belongsTo(() => Shortened)
	public shortened: BelongsTo<typeof Shortened>;
}
