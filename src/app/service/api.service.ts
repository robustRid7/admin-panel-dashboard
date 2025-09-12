import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

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

}
