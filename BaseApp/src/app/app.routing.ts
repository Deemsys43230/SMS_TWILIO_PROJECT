import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent, CommonLayoutComponent } from './containers';
import { SecurityService } from './core/services/security-service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path:'auth',
    component:CommonLayoutComponent,
    loadChildren:'./views/auth/auth.module#AuthModule'
  },
  {
    path:'user',
    component:DefaultLayoutComponent,
    loadChildren:'./views/sms/sms.module#SmsModule',
    canActivate:[SecurityService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
