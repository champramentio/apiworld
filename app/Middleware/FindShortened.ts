import Shortened from "App/Models/Shortened";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class FindShortened {
	public async handle(ctx: HttpContextContract, next: () => Promise<void>, schemes) {
		//main query
		const query = Shortened.query();

		//main query
		if (schemes.includes("byShortenedParameter")) query.where("shortened_hash", ctx.params.shortened_hash);
		else query.where("shortened_id", ctx.params.shortened_id); //by default

		//run query
		const exist = JSON.parse(JSON.stringify(await query));

		//validation
		if (exist.length === 0) {
			return ctx.response.json({
				error: "Shortened link not found"
			});
		}

		//set data ini sebagai request untuk acuan file berikutnya
		ctx.shortened = exist[0];

		// code for middleware goes here. ABOVE THE NEXT CALL
		await next();
	}
}
