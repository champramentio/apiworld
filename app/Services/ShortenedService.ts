import { DateTime } from "luxon";
import Utility from "Helpers/Utility";
import fs from "fs";
import Database from "@ioc:Adonis/Lucid/Database";
import Env from "@ioc:Adonis/Core/Env";
import Shortened from "App/Models/Shortened";

//file path
const shortenedFolder = "./log/shortened/";

export const ShortenedService = {
	getShortenedFolderPath() {
		return shortenedFolder;
	},

	setShortenedFileName(shortened_id) {
		return `${shortened_id}.csv`;
	},

	getShortenedRelativePath(shortened_id) {
		return `${this.getShortenedFolderPath()}${this.setShortenedFileName(shortened_id)}`;
	},

	getShortenedFullUrl(shortened_hash) {
		return `${Env.get("SHORTENER_DOMAIN")}/${shortened_hash}`;
	},

	async logClickRequest(data) {
		const passing: {
			shortened_id: number;
			user_agent: string;
			user_ip: string;
		} = {
			shortened_id: +data.shortened_id,
			user_agent: data.user_agent,
			user_ip: data.user_ip
		};

		try {
			//setup file
			const destinationFile = this.getShortenedRelativePath(passing.shortened_id);

			//baris yang mau ditulis
			const line = `${DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss")}|${passing.user_ip}|${passing.user_agent}`;

			//append
			fs.appendFileSync(destinationFile, `${line}\n`, "utf8");

			//update total clicked
			await Database.rawQuery("UPDATE shortened SET shortened_total_clicked = shortened_total_clicked + 1 WHERE shortened_id = ?", [passing.shortened_id]);

			//return message
			return { success: "Click request has been logged successfully" };
		} catch (error) {
			Utility.logging(`Failed to run logClickRequest in ShortenedService with data : ${JSON.stringify(passing)}`, `${JSON.stringify(error.message)}`, "error");
		}
	},

	async generateShortenedLink(data) {
		const passing = {
			shortened_original_link: data.shortened_original_link,
			user_ip: data.user_ip || null
		};

		try {
			//validasi panjang URL
			if (passing.shortened_original_link.length >= 500) return { error: "URL length should be less than 500 characters" };

			//cek dulu sudah pernah ada di db
			const found = await Shortened.findBy("shortened_original_link", passing.shortened_original_link);
			if (found)
				return {
					success: "Original link is already existed",
					data: found
				};

			//init
			let count;
			let random;
			let x = 1;

			//generate random string
			do {
				random = Utility.generateRandomString(Utility.generateRandomNumber(3, 5));
				count = await Shortened.findBy("shortened_hash", random);
				x++;
			} while (count === 1 && x <= 3); //coba 3x retry jika masih duplicate

			//save db
			const row = new Shortened();
			row.shortenedOriginalLink = passing.shortened_original_link;
			row.shortenedHash = random;
			row.shortenedIp = passing.user_ip;
			await row.save();

			//return message
			return {
				success: "Shortened link has been created successfully",
				data: await Shortened.find(row.shortenedId)
			};
		} catch (error) {
			Utility.logging(`Failed to run generateShortenedLink in ShortenedService with data : ${JSON.stringify(passing)}`, `${JSON.stringify(error.message)}`, "error");

			return {
				error: "Failed to generate shortened link, please try again" //return error, bisa karena kebetulan mengenerate dengan random string yang sudah pernah exist di database
			};
		}
	},

	async getDataFromShortenedFullUrl(data) {
		const passing = {
			url: data.url
		};

		try {
			const splitted = passing.url.split("/");
			const hash = splitted[splitted.length - 1];

			//cek dulu sudah pernah ada belum di db
			const found = await Shortened.findBy("shortened_hash", hash);
			if (!found) return { error: "Shortened URL not found" };

			//return message
			return {
				success: "Shortened URL has been fetched successfully",
				data: found
			};
		} catch (error) {
			Utility.logging(`Failed to run getDataFromShortenedFullUrl in ShortenedService with data : ${JSON.stringify(passing)}`, `${JSON.stringify(error.message)}`, "error");
		}
	}
};
