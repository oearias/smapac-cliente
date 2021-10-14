import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  URL_API= 'http://localhost:3000/api/orders/'

  constructor(
    private http: HttpClient
  ) { }

  generateOrder(contrato: number, amount: number ): Observable<any>{

    let data = {
      contrato, amount
    }

    return this.http.post(this.URL_API, data)
  }

  getOrderDetail(){

  }

  sendPayment(token: string, id: string): Promise<any>{
    return this.http.patch(`${this.URL_API}${id}`,
      {
        token
      }).toPromise()
  }

  confirmOrder(id:string): Promise<any>{
    return this.http.patch(`${this.URL_API}confirm/${id}`, {}).toPromise()
  }
}
