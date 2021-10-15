import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  form: FormGroup = new FormGroup({})

  constructor(
    private authService: AuthService,
    public router: Router,
    private  fb: FormBuilder
    ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.min(1)] ],
      password: ['', [Validators.required, Validators.minLength(6)]] //TODO true | false
    })

  }

  onLoginUser() {

    let error='';

    if(this.form.valid){

      this.authService.login(this.form.value).subscribe(res => {

        localStorage.setItem('token', res.token);
        localStorage.setItem('email', this.form.value.email);
  
        this.router.navigate(['/dashboard/valida', {email: this.form.value.email}]);
        
      }, err => {
  
        
  
        if(err.error){
  
          error = err.error.msg;
  
          if(err.error.errors){
            error =  err.error.errors[0]['msg'];
          }
  
          $('#errorMessage').text(error)
        }
        
      })
    }else{
      $('#errorMessage').text("Formulario invalido")
    }

    


  }

}
