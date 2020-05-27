import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { SendSmsComponent } from './send-sms/send-sms.component';
import { TemplatesComponent } from './templates/templates.component';
import { ContactsComponent } from './contacts/contacts.component';
import { SmsRoutingModule } from './sms-routing.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { AddGroupComponent } from './add-group/add-group.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgxSpinnerModule } from "ngx-spinner";


@NgModule({
  imports: [
    CommonModule,
    SmsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SmsRoutingModule,
    TagInputModule,
    NgxSpinnerModule,
    NgbModule.forRoot()
  ],
  declarations: [SettingsComponent,SendSmsComponent,TemplatesComponent,ContactsComponent, AddGroupComponent,ChangePasswordComponent]
})
export class SmsModule { }
