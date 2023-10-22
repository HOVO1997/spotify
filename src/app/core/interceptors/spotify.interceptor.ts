import {HttpInterceptorFn} from "@angular/common/http";
import {environment} from "../../../environments/environment";

export const SpotifyInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    setHeaders: {
      'X-RapidAPI-Key': environment.rapidApiKey,
      'X-RapidAPI-Host': environment.spotifyApiHost
    }
  });
  return next(req);
}
