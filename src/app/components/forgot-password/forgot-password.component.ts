import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  user = {
    email: ''
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  resetPassword() {

    let error=''

    this.authService.forgotPassword(this.user.email).subscribe(res => {

      console.log('from client ', res);

      if (res.info == 'OK') {

        //redirect
        this.router.navigate(['/reset']);

      }else{
        $('#errorMessage').text(res)
      }

    }, err => {


      if (err.error) {
        error = err.error.msg;

        if (err.error.errors) {
          error = err.error.errors[0]['msg'];
        }

        $('#errorMessage').text(error)
      }
    })
  }

}
