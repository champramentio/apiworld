/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
	return { hello: "world" };
});

//shortened
Route.get("/shortened", "ShortenedController.getIndex");
Route.get("shortened/:shortened_hash", "ShortenedController.getInfo").middleware("FindShortened:byShortenedParameter");
Route.post("/shortened", "ShortenedController.postAdd");
Route.get("/shortened/:shortened_hash/file", "ShortenedController.getFile").middleware("FindShortened:byShortenedParameter");

//url redirect
Route.get("/url/:shortened_hash", "ShortenedController.getRedirection").middleware("FindShortened:byShortenedParameter");
