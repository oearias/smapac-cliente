import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  user = {
    email : ''
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  resetPassword(){
    this.authService.resetPassword(this.user.email).subscribe(res => {
      if(res.info == 'OK'){

        //redirect
        this.router.navigate(['/reset']);

      }

    }, err => {
      console.log(err.message);
    })
  }

}
