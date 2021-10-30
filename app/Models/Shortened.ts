import { DateTime } from "luxon";
import { BaseModel, column, computed, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";
import Env from "@ioc:Adonis/Core/Env";
import ShortenedDetail from "App/Models/ShortenedDetail";

export default class Shortened extends BaseModel {
	public static table = "shortened";

	@column({ isPrimary: true })
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

	@hasMany(() => ShortenedDetail)
	public detail: HasMany<typeof ShortenedDetail>;
}
