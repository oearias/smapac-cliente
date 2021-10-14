import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL_API = environment.apiUrl

  constructor(
    private http: HttpClient
  ) { }

  login(user: any){
    return this.http.post<any>(this.URL_API+'auth/login', user);
  }

  loggedIn(){
    return !!(localStorage.getItem('token'));
  }

  getToken(){
    return localStorage.getItem('token');
  }

  resetPassword(email: string){
    return this.http.put<any>(this.URL_API+'auth/forgot-password',{email});
  }
}
