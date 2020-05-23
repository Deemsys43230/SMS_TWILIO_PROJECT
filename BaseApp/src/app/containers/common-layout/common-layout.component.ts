import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './common-layout.component.html'
})
export class CommonLayoutComponent {
  constructor() {
    document.body.classList.remove("header-fixed","sidebar-lg-show","sidebar-fixed");

  }
}
