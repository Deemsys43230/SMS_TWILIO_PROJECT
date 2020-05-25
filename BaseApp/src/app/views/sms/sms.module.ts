import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { SendSmsComponent } from './send-sms/send-sms.component';
import { TemplatesComponent } from './templates/templates.component';
import { ContactsComponent } from './contacts/contacts.component';
import { SmsRoutingModule } from './sms-routing.module';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';




@NgModule({
  imports: [
    CommonModule,
    SmsRoutingModule,
    TagInputModule,
    FormsModule
  ],
  declarations: [SettingsComponent,SendSmsComponent,TemplatesComponent,ContactsComponent]
})
export class SmsModule { }
