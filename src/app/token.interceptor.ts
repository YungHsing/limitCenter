import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { BaseService } from './base.service';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router, public baseService: BaseService) {}
  private from: string = environment.from;
  private allowOrigin: string = environment.allowOrigin;
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authStr = request.url.indexOf('login') != -1 ? '' : 'Bearer ' + this.baseService.getToken();
    request = request.clone({
      setHeaders: {
        'Authorization': authStr,
        'Access-Control-Allow-Origin': environment.allowOrigin,
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
        'Access-Control-Expose-Headers': 'ticket'
      }
    });
    return next.handle(request).pipe(map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        if (authStr.length > 0) {
          let token: string = authStr.replace('Bearer ', '');
          let ticket: string = event.headers.get('ticket');
          if (token != ticket) {
            if (this.baseService.logOutAction()) {
              if (('stg' == this.from || 'uat' == this.from || 'prod' == this.from)) {
                this.router.navigate(['./logOut']).then(async () => {
                  window.location.href = 'https://sso.lbtwsys.com:8443/cas/logout?service=' + this.allowOrigin + '/sso';
                });
              } else {
                this.router.navigate(['./logOut']).then(async () => {
                  window.location.reload();
                });
              }
            }
          }
        }
      }
      return event;
    }));
  }
}
