import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare var $: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = {
    email: '',
    password: ''
  }

  constructor(
    private authService: AuthService,
    public router: Router
    ) { }

  ngOnInit(): void {
  }

  onLoginUser() {

    this.authService.login(this.user).subscribe(res => {

      localStorage.setItem('token', res.token);
      localStorage.setItem('email', this.user.email);

      this.router.navigate(['/valida', {email: this.user.email}]);
      
    }, err => {

      let error=''

      if(err.error){

        error = err.error.msg;

        if(err.error.errors){
          error =  err.error.errors[0]['msg'];
        }

        $('#errorMessage').text(error)
      }
      
    })


  }

}
