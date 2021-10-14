import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ValidaContratoComponent } from './components/valida-contrato/valida-contrato.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RespuestaComponent } from './components/respuesta/respuesta.component';
import { HomeComponent } from './components/home/home.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { CheckoutComponent } from './components/checkout/checkout.component';

import {TOAST_NOTIFICATIONS_CONFIG, ToastNotificationsModule} from "ngx-toast-notifications";
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { InfoPasswordComponent } from './components/info-password/info-password.component';


const routes: Route[] = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset', component: InfoPasswordComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  {
    path: 'valida', component: ValidaContratoComponent, canActivate: [AuthGuard],
    children: [{ path: 'login', redirectTo: 'valida', pathMatch: 'full' }],
  }
]

/*
const routes: Route[] = [
  {path: '', component: ValidaContratoComponent},
  {
    path: '', component: ValidaContratoComponent,
    children: [{path: 'valida', redirectTo:'valida', pathMatch: 'full'}]
  }
]
*/

@NgModule({
  declarations: [
    AppComponent,
    ValidaContratoComponent,
    LoginComponent,
    RegisterComponent,
    RespuestaComponent,
    HomeComponent,
    CheckoutComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    InfoPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes, { useHash: true }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastNotificationsModule,
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthService,
    AuthGuard,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  },
  {provide: TOAST_NOTIFICATIONS_CONFIG, useValue: {duration: 6000, type: 'dark', position: 'top-center'}},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
