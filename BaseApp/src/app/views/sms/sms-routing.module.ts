import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { ContactsComponent } from './contacts/contacts.component';
import { SendSmsComponent } from './send-sms/send-sms.component';
import { SettingsComponent } from './settings/settings.component';
import { TemplatesComponent } from './templates/templates.component';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'contacts',
    pathMatch: 'full',
  },
  {
    path:'contacts',
    component:ContactsComponent,
  },
  {
    path:'send-sms',
    component:SendSmsComponent,
  },
  {
    path:'settings',
    component:SettingsComponent
  },
  {
    path:'templates',
    component:TemplatesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsRoutingModule { }
