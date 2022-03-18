import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContratoService } from '../../services/contrato.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RestService } from '../../services/rest.service';
import { SpinnerService } from '../../services/spinner.service';
import { LoadingService } from '../../services/loading.service';
import { ReciboService } from '../../services/recibo.service';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-valida-contrato',
  templateUrl: './valida-contrato.component.html',
  styleUrls: ['./valida-contrato.component.css']
})
export class ValidaContratoComponent implements OnInit {


  createFormGroup() {
    return new FormGroup({
      name: new FormControl(['', [Validators.required]]),
      amount: new FormControl(['', [Validators.required, Validators.min(5)]])
    })
  }

  form: FormGroup;


  contratos: any[] = [];
  contrato: any;
  periodo: any;
  referencia: any;
  signature: any;
  monto!: number;
  idexpress= "2328";
  //idexpress = environment.idExpress;

  //mes -1 para que sea el exacto
  fechaVencimiento !: any;
  vencido : boolean = false;

  infoMessage: String = "";

  user = {
    email: '',
    nombre: ''
  }

  isLoading$ = this.spinnerService.isLoading$;
  isLoadingReverse$ = this.spinnerService.isLoadingReverse$;

  isLoadingRecibo$ = this.spinnerService.isLoadingRecibo$;

  is$ = this.spinnerService.isLoadingPago$

  /*isLoading$ = this.loadingService.isLoading$;
  isLoadingReverse$ = this.loadingService.isLoadingReverse$*/

  constructor(
    private contratoService: ContratoService,
    private userService: UserService,
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    public spinnerService: SpinnerService,
    public loadingService: LoadingService,
    private reciboService: ReciboService
  ) {
    this.form = this.createFormGroup();

    this.form.setValue({
      amount: '',
      name: ''
    })
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.user.email = params.email
    });

    this.getUser();
    this.getPeriodo();

    $("#contratoId").keyup((event: any) => {

      let valor = $("#contratoId").val();

      if (valor.length > 0) {
        $("#btnContrato").removeAttr('disabled');
      } else {
        $("#btnContrato").attr('disabled', true);
      }

      if (event.keyCode === 13) {

        this.getContrato();

      }

    });

    $("#contratoId").change(function (event: any) {

      let valor = $("#contratoId").val();

      if (valor.length > 0) {

        $("#btnContrato").removeAttr('disabled');
      } else {
        $("#btnContrato").attr('disabled', true);
      }
    })

    $("#btnContrato").click(() => {
      if (this.isLoading$) {
        $("#btnContrato").attr('disabled', true);
      }
    })


  }

  getContratos() {
    this.contratoService.getContratos().subscribe(res => {

      this.contratos = res.contratos

    });
  }

  getContrato() {

    $("#btnContrato").attr('disabled', true);

    let id = $('#contratoId').val();

    this.contratoService.getContrato(id).subscribe(res => {

      if (res) {
        $("#btnContrato").removeAttr('disabled');
      }

      this.contrato = res;
      this.infoMessage = '';

      this.referencia = this.generateReferencia(this.contrato?.contrato);

      if (this.contrato?.adeuda) {

        this.monto = res.adeuda;

        this.generateSignature(this.referencia, this.contrato?.adeuda).then(res => {
          this.signature = res;

          /*let importe = document.getElementById("importe");
          importe?.setAttribute("value", String(this.monto));

          let referencia = document.getElementById("referencia");
          referencia?.setAttribute("value", this.referencia);*/

          //this.generateForm();
        });

      }

      if (this.contrato['msg']) {
        this.infoMessage = this.contrato['msg'];
      }

    })
  }

  //
  getPeriodo(){
    this.contratoService.getPeriodo().subscribe(res => {
      this.periodo = res;

      console.log(res);
    });
  }

  generateReferencia(contrato: number) {

    let fecha = new Date();

    let y = String(fecha.getFullYear());
    //let m = String(fecha.getMonth());
    let m = ("0" + (fecha.getMonth() + 1)).slice(-2)
    let d = String(fecha.getDate());
    //let h = String(fecha.getHours());
    let h = ("0" + (fecha.getHours())).slice(-2)
    let mm = ("0" + (fecha.getMinutes())).slice(-2)
    let s = ("0" + (fecha.getSeconds())).slice(-2)
    let ms = ("0" + (fecha.getMilliseconds())).slice(-2)

    let cadena = 'REF_' + contrato + '_' + y + m + d + '-' + h + mm + s + ms;

    return cadena;

  }

  getUser() {

    //preguntamos si hay email en el localstorage

    if ((this.user.email == '') || (!this.user.email)) {

      this.user.email = localStorage.getItem('email') || '';
    }

    this.userService.getUser(this.user.email).subscribe(res => {
      this.user.nombre = res.nombre
    })

  }

  async generateSignature(referencia: string, importe: number) {

    //let key = '5tuJoT8BcTVlBbGzd-0x';  //ejemplo pdf
    let key = 'QvgGUjXOBnmRjc2CvHJ6'
    const idExpress = "2328";
    //let message = 'REF0011.001470'; 

    let message = referencia + importe + idExpress;
    let result;


    const getUtf8Bytes = (str: any) =>
      new Uint8Array(
        [...unescape(encodeURIComponent(str))].map(c => c.charCodeAt(0))
      );

    const keyBytes = getUtf8Bytes(key);
    const messageBytes = getUtf8Bytes(message);

    const cryptoKey = await crypto.subtle.importKey(
      'raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' },
      true, ['sign']
    );

    const sig = await crypto.subtle.sign('HMAC', cryptoKey, messageBytes);

    result = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');

    btoa(String.fromCharCode(...new Uint8Array(sig)));


    //console.log([...new Uint8Array(sig)].map(b => b.toString(16).padStart(2,'0')).join(''));

    this.signature = result;


    return result;


  }

  tocheckout(importe: number, contrato: number, nombre: string, email: string) {

    $("#btnGenPago").attr('disabled', true);

    this.restService.generateOrder(contrato, importe, nombre, email).subscribe((data) => {

      $('#btnGenPago').attr('disabled', false);
      this.router.navigate(['/dashboard/checkout', { localizator: data?.localizator, amount: importe, nombre: nombre, contrato: contrato }])
    })
  }

  generateForm() {

    var form;
    let importe, referencia, signature, urlretorno, idexpress, financiamiento, plazos, mediospago;


    const uri = "https://www.adquiramexico.com.mx:443/mExpress/pago/avanzado";
    const retorno = 'https://restserver-smapac.herokuapp.com/api/orders/respuesta.html'

    form = document.createElement("form");
    form.method = "post";
    form.action = uri;

    //importe
    importe = document.createElement("input");
    importe.setAttribute("name", "importe");
    //importe.setAttribute("value", this.contrato?.adeuda);
    importe.setAttribute("value", "1");

    //referencia
    referencia = document.createElement("input");
    referencia.setAttribute("name", "referencia");
    referencia.setAttribute("value", this.referencia);

    //signature
    signature = document.createElement("input");
    signature.setAttribute("name", "signature");
    signature.setAttribute("value", this.signature);

    console.log(this.signature);

    //urlRetorno
    urlretorno = document.createElement("input");
    urlretorno.setAttribute("name", "urlretorno");
    urlretorno.setAttribute("type", "hidden");
    urlretorno.setAttribute("value", retorno);

    //idExpress
    idexpress = document.createElement("input");
    idexpress.setAttribute("name", "idexpress");
    idexpress.setAttribute("type", "hidden");
    idexpress.setAttribute("value", "2328");

    //financiamiento
    financiamiento = document.createElement("input");
    financiamiento.setAttribute("name", "financiamiento");
    financiamiento.setAttribute("type", "hidden");
    financiamiento.setAttribute("value", "");

    //plazos
    plazos = document.createElement("input");
    plazos.setAttribute("name", "plazos");
    plazos.setAttribute("type", "hidden");
    plazos.setAttribute("value", "");

    //mediospago
    mediospago = document.createElement("input");
    mediospago.setAttribute("name", "mediospago");
    mediospago.setAttribute("type", "hidden");
    mediospago.setAttribute("value", "110000");


    form.appendChild(importe);
    form.appendChild(referencia);
    form.appendChild(signature);
    form.appendChild(urlretorno);
    form.appendChild(idexpress);
    form.appendChild(financiamiento);
    form.appendChild(plazos);
    form.appendChild(mediospago);

    document.body.appendChild(form);
    form.submit();

  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }

  multipagos() {
    this.router.navigate(['/dashboard/multipagos']);
  }

  imprimeRecibo(){

    this.reciboService.downloadRecibo(this.contrato?.contrato);
    
  }

  validaFecha(){

    let fechaHoy = new Date();
    let diaHoy = fechaHoy.getDay()
    let mes;
    
    mes = this.devuelveMes(fechaHoy.getMonth());

    if(diaHoy < 15 ){

      mes = mes! -1;
      this.fechaVencimiento = new Date(fechaHoy.getFullYear(), mes, 15);

    }else{
      this.fechaVencimiento = new Date(fechaHoy.getFullYear(), mes!, 15);
    }

    if(fechaHoy > this.fechaVencimiento){
      this.vencido = false;
    }else{
      this.vencido = true;
    }

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }
    
    this.fechaVencimiento = this.fechaVencimiento.toLocaleString('es-MX',options);
   //this.fechaVencimiento = this.fechaVencimiento.getDate() +"/"+("0" + this.fechaVencimiento.getMonth()).slice(-2) +"/"+ this.fechaVencimiento.getFullYear();

    
  }

  devuelveMes(mes: number){

    let aux;

    switch(mes){
      case 0: aux = 1;
      break;

      case 1: aux = 2;
      break;

      case 2: aux = 3;
      break;

      case 3: aux = 4;
      break;

      case 4: aux = 5;
      break;

      case 5: aux = 6;
      break;

      case 6: aux = 7;
      break;

      case 7: aux = 8;
      break;

      case 8: aux = 9;
      break;

      case 9: aux = 10;
      break;

      case 10: aux = 11;
      break;

      case 11: aux = 12;
      break;

      default: 0;
    }

    return aux;
  }


}
