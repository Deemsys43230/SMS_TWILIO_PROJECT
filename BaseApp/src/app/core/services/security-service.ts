import { Injectable } from "../../../../node_modules/@angular/core";
import { CanActivate, Router, ActivatedRoute, RouterStateSnapshot, ActivatedRouteSnapshot } from "../../../../node_modules/@angular/router";
import { UserApiService } from "../http/user-api-service";
import { Observable } from "../../../../node_modules/rxjs";



@Injectable({
    providedIn: 'root'
})

export class SecurityService implements CanActivate {

    constructor(private router: Router, private userService: UserApiService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
        var role = route.data.role;
        const loginStatus = localStorage.getItem('isLogin');
        if (loginStatus === 'true') {
            var self = this;
            return this.userService.getProfile().then(res => {
                if (res.data.role == role) {
                    return true
                }
                else {
                    self.router.navigate(['/auth/login'])
                    return false;
                }
            })
        }
        else {
            return false;
        }
    }

}