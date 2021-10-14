import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) { }

  intercept(req:any, next:any){
    const tokenizeReq = req.clone({
      setHeaders: {
        Authorization: `${this.authSvc.getToken()}`,
        'x-token': `${this.authSvc.getToken()}`
      }
    })

    return next.handle(tokenizeReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status === 401){
          this.router.navigateByUrl('/');
        }

        return throwError(err);
      })
    )
  }
}
