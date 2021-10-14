import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = {
    nombre: '',
    email: '',
    password: ''
  }

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  onRegisterUser(){

    //Validar contraseña
    let a, b, messageError;

    a = $('#password').val();
    b = $('#passAux').val();

    if(a == b ){
      
      this.userService.createUser(this.user).subscribe( res => {
        console.log(res);

        alert(res['msg']+'. Por favor inicie sesión');

        this.router.navigate(['/']);

      }, err => {
        if(err.error){

          messageError = err.error.errors[0]['msg'];
          $('#errorMessage').text(messageError);
        }
      });
      
    }else{
      messageError = '*Las contraseñas no coinciden'
      $('#errorMessage').text(messageError);
    }


  }

}
