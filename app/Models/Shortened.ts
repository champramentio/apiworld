import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Shortened extends BaseModel {
	public static table = "shortened";

	@column({ isPrimary: true })
	public shortenedId: number;

	@column() public shortenedOriginalLink: string;

	@column() public shortenedHash: string;

	@column() public shortenedIp: string;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;
}
