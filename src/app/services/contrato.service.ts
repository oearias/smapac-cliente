import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ResContrato, Contrato } from '../models/contrato';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  private URL_API = environment.apiUrl

  constructor(
    private http: HttpClient
  ) { }

  getContratos(){
    return this.http.get<ResContrato>(this.URL_API+'contratos/');
  }

  getContrato( id:number ){
    console.log(id);
    return this.http.get<Contrato>(this.URL_API+'contratos/'+id);
  }

  getPeriodo(){
    return this.http.get<any>(this.URL_API+'periodos/');
  }
  
}
