import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { SendSmsComponent } from './send-sms/send-sms.component';
import { TemplatesComponent } from './templates/templates.component';
import { ContactsComponent } from './contacts/contacts.component';
import { SmsRoutingModule } from './sms-routing.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { AddGroupComponent } from './add-group/add-group.component';



@NgModule({
  imports: [
    CommonModule,
    SmsRoutingModule,
    PopoverModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SmsRoutingModule,
    TagInputModule,
  ],
  declarations: [SettingsComponent,SendSmsComponent,TemplatesComponent,ContactsComponent, AddGroupComponent]
})
export class SmsModule { }
