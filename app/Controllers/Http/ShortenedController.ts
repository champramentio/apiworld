// import EventEmitter from "@ioc:Adonis/Core/Event";
import Shortened from "App/Models/Shortened";
import { ShortenedService } from "App/Services/ShortenedService";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import fs from "fs";
import Utility from "Helpers/Utility";

export default class ShortenedController {
	public async getIndex({ response }) {
		return response.json({
			success: "Shorteneds have been fetched successfully",
			data: await Shortened.all()
		});
	}

	public async getInfo(ctx) {
		try {
			return ctx.response.json({
				success: "Shortened link has been fetched successfully",
				data: ctx.shortened
			});
		} catch (error) {
			Utility.catchError(ctx.request, ctx.response, error);
		}
	}

	public async postAdd({ request, response }) {
		try {
			const formData = request.only(["shortened_original_link"]);

			//data untuk di catat sebagai log
			request.formData = formData;

			//generate
			const result = await ShortenedService.generateShortenedLink({
				shortened_original_link: formData.shortened_original_link,
				user_ip: request.ip()
			});

			return response.json(result);
		} catch (error) {
			Utility.catchError(request, response, error);
		}
	}

	public async getRedirection(ctx: HttpContextContract) {
		try {
			if (ctx!.shortened!.shortened_original_link) {
				//log clicking request
				ShortenedService.logClickRequest({
					shortened_id: ctx!.shortened!.shortened_id,
					user_agent: ctx.request.header("user-agent"),
					user_ip: ctx.request.ip()
				});

				ctx.response.redirect(ctx!.shortened!.shortened_original_link);
			}
		} catch (error) {
			Utility.catchError(ctx.request, ctx.response, error);
		}
	}

	public async getFile(ctx: HttpContextContract) {
		try {
			//path file yang mau didownload
			const fullPath = ShortenedService.getShortenedRelativePath(ctx!.shortened!.shortened_id);

			//check existance of the file
			if (!fs.existsSync(fullPath)) return ctx.response.json({ error: "File not found" });

			//file exists
			return ctx.response.download(fullPath);
		} catch (error) {
			Utility.catchError(ctx.request, ctx.response, error);
		}
	}
}
