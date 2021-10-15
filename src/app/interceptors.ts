import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { SpinnerService } from './services/spinner.service';
import { TokenInterceptorService } from './services/token-interceptor.service';



export const interceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerService, multi: true }
]