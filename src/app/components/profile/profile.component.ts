import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = {
    nombre: '',
    email: ''
  }



  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getUser();

    $('#inputNombre').hide(); 
    $('#btnSave').hide();
    $('#btnCancel').hide();

    $('#inputNombre').keyup((event: any) => {
      console.log(event);
    });

  }

  getUser(){
    if ((this.user.email == '') || (!this.user.email)) {

      this.user.email = localStorage.getItem('email') || '';
      this.user.nombre = localStorage.getItem('nombre') || '';

    }

    /*this.userService.getUser(this.user.email).subscribe(res => {
      this.user.nombre = res.nombre
    })*/

  }

  editUser(){

    $('#inputNombre').val(this.user.nombre)
    $('#inputNombre').show();    

    $('#btnEdit').hide();
    $('#nombreRes').hide();

    $('#btnSave').show();
    $('#btnCancel').show();
    $('#btnSave').attr('disabled', true);


  }

  cancel(){
    $('#btnSave').hide();
    $('#btnCancel').hide();
    $('#inputNombre').hide();

    $('#btnEdit').show();
    $('#nombreRes').show();
  }

}
