import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContratoService } from '../../services/contrato.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RestService } from '../../services/rest.service';

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
  referencia: any;
  signature: any;

  infoMessage: String = "";

  user = {
    email: '',
    nombre: ''
  }

  constructor(
    private contratoService: ContratoService,
    private userService: UserService,
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.createFormGroup();

    this.form.setValue({
      amount: '',
      name: ''
    })
  }

  ngOnInit(): void {


    //this.getContratos();

    this.route.params.subscribe(params => {
      this.user.email = params.email

    })

    this.getUser();

    $("#contratoId").keyup(function (event: any) {
      if (event.keyCode === 13) {
        $("#btnContrato").click();
      }
    });


  }

  getContratos() {
    this.contratoService.getContratos().subscribe(res => {

      this.contratos = res.contratos

    });
  }

  getContrato() {

    let id = $('#contratoId').val();

    this.contratoService.getContrato(id).subscribe(res => {

      this.contrato = res;
      this.infoMessage = '';

      this.referencia = this.generateReferencia(this.contrato?.contrato);

      if (this.contrato?.adeuda) {

        this.generateSignature(this.referencia, this.contrato?.adeuda).then(res => {
          this.signature = res;
        });

      }



      if (this.contrato['msg']) {
        this.infoMessage = this.contrato['msg'];
      }

    })
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
      console.log("si hay email desde el storage");

      this.user.email = localStorage.getItem('email') || '';
    }

    this.userService.getUser(this.user.email).subscribe(res => {
      this.user.nombre = res.nombre
    })

  }

  async generateSignature(referencia: string, importe: number) {

    //let key = '5tuJoT8BcTVlBbGzd-0x';  //ejemplo pdf
    let key = 'QvgGUjXOBnmRjc2CvHJ6'
    let idExpress = 1545;
    //let message = 'REF0011.001470'; 

    let message = referencia + importe + idExpress;
    let result;

    console.log(this.referencia);
    console.log(importe);
    console.log(idExpress);

    console.log(message);


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

    console.log(this.signature);

    return result;


  }

  tocheckout(importe: number, contrato: number, nombre: string) {

    this.restService.generateOrder(contrato, importe, nombre).subscribe((data) => {

      this.router.navigate(['/checkout', { localizator: data?.localizator, amount: importe, nombre: nombre, contrato: contrato }])
    })


  }

  generateForm() {

    var form;
    let importe, referencia, signature, urlretorno, idexpress, financiamiento, plazos, mediospago;


    const uri = "https://www.adquiramexico.com.mx:443/mExpress/pago/avanzado";
    const retorno = 'http://localhost:4200/#/respuesta'

    form = document.createElement("form");
    form.method = "post";
    form.action = uri;

    //importe
    importe = document.createElement("input");
    importe.setAttribute("name", "importe");
    importe.setAttribute("value", this.contrato?.adeuda);

    //referencia
    referencia = document.createElement("input");
    referencia.setAttribute("name", "referencia");
    referencia.setAttribute("value", this.referencia);

    //signature
    signature = document.createElement("input");
    signature.setAttribute("name", "signature");
    signature.setAttribute("value", this.signature);

    //urlRetorno
    urlretorno = document.createElement("input");
    urlretorno.setAttribute("name", "urlretorno");
    urlretorno.setAttribute("type", "hidden");
    urlretorno.setAttribute("value", retorno);

    //idExpress
    idexpress = document.createElement("input");
    idexpress.setAttribute("name", "idexpress");
    idexpress.setAttribute("type", "hidden");
    idexpress.setAttribute("value", "1545");

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

}
