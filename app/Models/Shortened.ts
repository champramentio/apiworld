import { DateTime } from "luxon";
import { BaseModel, column, computed } from "@ioc:Adonis/Lucid/Orm";
import Env from "@ioc:Adonis/Core/Env";

export default class Shortened extends BaseModel {
	public static table = "shortened";

	@column({ isPrimary: true, serializeAs: null })
	public shortenedId: number;

	@column() public shortenedOriginalLink: string;

	@column() public shortenedHash: string;

	@column({ serializeAs: null })
	public shortenedIp: string;

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
	public updatedAt: DateTime;

	@computed()
	public get shortened_link() {
		return `${Env.get("SHORTENER_DOMAIN")}/${this.shortenedHash}`;
	}
}
