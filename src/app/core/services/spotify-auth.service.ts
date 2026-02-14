import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environment/environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SpotifyAuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl + environment.apiSpotifyUrl;

  login(): void {
    window.location.href = `${this.baseUrl}/login`;
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/status`);
  }

  logout(): void {
    // plus tard
  }
}
