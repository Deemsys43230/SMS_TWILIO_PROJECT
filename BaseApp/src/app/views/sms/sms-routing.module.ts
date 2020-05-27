import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { ContactsComponent } from './contacts/contacts.component';
import { SendSmsComponent } from './send-sms/send-sms.component';
import { SettingsComponent } from './settings/settings.component';
import { TemplatesComponent } from './templates/templates.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ImportContactsComponent } from './import-contacts/import-contacts.component';



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
    path:'contacts/add-edit-group/:groupId',
    component:AddGroupComponent,
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
  {
    path:'contacts/import-contacts',
    component:ImportContactsComponent,
  },
  {
    path:'change-password',
    component:ChangePasswordComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsRoutingModule { }
