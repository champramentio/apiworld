/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import EventEmitter from "@ioc:Adonis/Core/Event";
import { ShortenedService } from "App/Services/ShortenedService";

EventEmitter.on("ShortenedService::generateShortenedLink", data => {
	ShortenedService.generateShortenedLink(data);
});
