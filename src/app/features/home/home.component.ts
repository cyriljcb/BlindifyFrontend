import { inject } from '@angular/core';
import { SpotifyAuthService } from './../../core/services/spotify-auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private authService = inject(SpotifyAuthService);
  private router = inject(Router);

  isAuthenticated = false;
  isLoading = true;

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe({
      next: (isAuth) => {
        this.isAuthenticated = isAuth;
        this.isLoading = false;
      },
      error:()=>{
        this.isAuthenticated = false;
        this.isLoading = false;
      }
    });
  }

  login():void{
    this.authService.login();
  }
  
  viewPlaylists(): void {
    // Mode consultation : voir les playlists et leurs tracks
    this.router.navigate(['/playlists'], { 
      queryParams: { mode: 'browse' } 
    });
  }
  
  startGame():void{
    // Mode jeu : sélectionner une playlist pour jouer
    this.router.navigate(['/playlists'], { 
      queryParams: { mode: 'play' } 
    });
  }
}