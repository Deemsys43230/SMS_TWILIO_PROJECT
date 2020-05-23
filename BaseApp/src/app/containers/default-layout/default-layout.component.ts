import { Component, Input } from '@angular/core';
import { UserApiService } from '../../core/http/user-api-service';
import { BehaviorSubject } from '../../../../node_modules/rxjs';
import { UserModel } from '../../core/models/user-model';
import { MenuItems } from './../../_nav';
import {  Router, ActivatedRoute } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {

  
  public navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  constructor(private userService:UserApiService,private router:Router,private route:ActivatedRoute) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized')
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });


  //switch betweeen buttons
  if (router.url.indexOf('clinic') > 0) {
    this.navItems=new MenuItems().cAdminMenus;
  }else if (router.url.indexOf('biller') > 0) {
   this.navItems=new MenuItems().billerMenus;
 }
}
  logout()
  {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
