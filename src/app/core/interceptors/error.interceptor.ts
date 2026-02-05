import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { SpotifyAuthService } from "../services/spotify-auth.service";

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(SpotifyAuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token invalide ou expiré
        console.warn('401 Unauthorized – déconnexion...');
        // ou refresh token 
      } else if (error.status >= 400 && error.status < 500) {
        console.error('Erreur client', error.message);
      } else if (error.status >= 500) {
        console.error('Erreur serveur', error.message);
      }
      return throwError(() => error);
    })
  );
};