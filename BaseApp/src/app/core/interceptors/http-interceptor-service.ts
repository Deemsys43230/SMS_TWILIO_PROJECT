import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http';
import 'rxjs/add/operator/do'
import { environment } from '../../../environments/environment';
import { Router } from '../../../../node_modules/@angular/router';
@Injectable({
  providedIn: 'root'
})
export class HttpnceptorService implements HttpInterceptor{
  
  constructor(private router:Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler){
    
   //Save Instance
   let self=this;

    const request = req.clone({
      headers: req.headers.set(
        'Authorization', "Bearer "+ localStorage.getItem("Authorization-Token")
      ),
      url: environment.domainName+req.url
    });
    
    return next.handle(request).do(
      function(res)
      {
        return res;
      },
      function(err){
        if(err.status=='403'){
          self.router.navigate(['/auth/login']);
      }      }
      );
  }
}
