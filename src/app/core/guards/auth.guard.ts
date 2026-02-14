import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SpotifyAuthService } from '../services/spotify-auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(SpotifyAuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map(isAuth => {
      if (isAuth) {
        return true;
      }

      router.navigate(['/']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/']);
      return of(false);
    })
  );
};
