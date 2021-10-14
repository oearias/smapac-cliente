import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  onRegisterUser() {

    //Validar contraseña
    let a, b, messageError;

    a = $('#password').val();
    b = $('#passAux').val();

    if (a == b) {

      this.userService.createUser(this.user).subscribe(res => {

        //alert(res['msg']+'. Por favor inicie sesión');

        this.authService.login(this.user).subscribe(res => {
          console.log(res);

          localStorage.setItem('token', res.token);
          localStorage.setItem('email', this.user.email);

          this.router.navigate(['/valida', { email: this.user.email }]);

        })



      }, err => {
        if (err.error) {

          messageError = err.error.errors[0]['msg'];
          $('#errorMessage').text(messageError);
        }
      });

    } else {
      messageError = '*Las contraseñas no coinciden'
      $('#errorMessage').text(messageError);
    }


  }

}
