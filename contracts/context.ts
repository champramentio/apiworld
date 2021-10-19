declare module "@ioc:Adonis/Core/HttpContext" {
	interface HttpContextContract {
		shortened: {
			shortened_id: number;
			shortened_original_link: string | "";
		} | null;
	}
}
