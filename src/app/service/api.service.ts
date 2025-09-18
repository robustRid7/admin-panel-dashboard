import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private TOKEN_KEY = 'token';
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); // agar token hai to logged in
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/admin/login`, data);
  }

  signUpUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/fetch`, data);

  }

  landingPageList(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/landing-page-users/fetch`, data);
  }

  bonusPageList(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/bonus-page-users/fetch`, data);
  }

  getDashBoardCompainList(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/dash-board/campaigns`, data);
  }

  searchCountList(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/dash-board/campaigns/count`, data);
  }

  getDashboardAnalytics(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/dash-board/campaigns/own/analytics`, data);
  }

  getDashboardThirdPartyAnalytics(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/dash-board/campaigns/third-party/analytics`, data);
  }

  getDashboardMetaAnalytics(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/dash-board/campaigns/meta/analytics`, data);
  }

  getWhatsUpUserList(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/whatsapp/fetch`, data);
  }

  getDomainList(data: any): Observable<any>{
  return this.http.post(`${this.baseUrl}/dash-board/domains`, data);
  }
}
