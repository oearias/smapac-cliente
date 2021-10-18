import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpRequest, HttpErrorResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(
    private authSvc: AuthService,
    private spinnerService: SpinnerService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    if(req.body?.token){
      this.spinnerService.show();
    }

    if(req.body?.password){
      this.spinnerService.show();
    }

    let tokenReset = localStorage.getItem('io-temp');

    if(!tokenReset){
      tokenReset = '1234'
    }

    const tokenizeReq = req.clone({
      setHeaders: {
        Authorization: `${this.authSvc.getToken()}`,
        'x-token': `${this.authSvc.getToken()}`,
        'reset': `${tokenReset}`
      }
    })

    return next.handle(tokenizeReq).pipe(
      finalize(()=>this.spinnerService.hide()),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.router.navigateByUrl('/');
        }



        return throwError(err);
      })
      
    )
  }
}
