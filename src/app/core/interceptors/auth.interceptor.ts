import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { SpotifyAuthService } from "../services/spotify-auth.service";
import { inject } from "@angular/core";

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(SpotifyAuthService);
  const token = authService.getToken();

  if (token && req.url.startsWith("http://localhost:8080/blindtest")) {
    const requestWithAuth = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(requestWithAuth);
  }

  return next(req);
};
