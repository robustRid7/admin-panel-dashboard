import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('token'); // login ke time token save kiya tha
    if (isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/login']); // agar login nahi hai to login page pe bhej do
      return false;
    }
  }
  
}
