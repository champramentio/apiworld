"use strict";

import Logger from "@ioc:Adonis/Core/Logger";

const Utility = {
	generateRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	},

	generateRandomString(length) {
		let text = "";
		const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (let i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	},

	logging(subject, content, type = "info") {
		Logger[type](`-------- ${new Date().toLocaleString()} : ${subject} --------`);
		if (content !== null) Logger[type](content);
	},

	catchError(request, response, error, return_back = true) {
		const message = error.message ? error.message : error.error;
		this.logging(`Query failed on ${request.method()} ${request.url()}`, message, "error");

		//response back jika ada permintaan
		if (return_back) return response.json({ error: error.code ? `Unexpected error happened (${error.errno || "N/A"} : ${error.code})` : message });
	}
};

export default Utility;
