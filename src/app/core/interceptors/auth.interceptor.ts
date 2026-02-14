import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { SpotifyAuthService } from "../services/spotify-auth.service";
import { inject } from "@angular/core";
import { environment } from "../../../environment/environment";


export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return next(req);
};

