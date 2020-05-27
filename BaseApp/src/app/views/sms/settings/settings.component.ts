import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ValidationUtil } from '../../../util/validation.util';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../core/services/user.service';
import $ from 'jquery';
declare var $: $;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public isFormSubmitted = false;
  public settingsForm: FormGroup;
  public validateUserFrom: FormGroup;
  public status = false;
  public settingsFormFields = {
    id: ['',Validators.required],
    cellPhonePrefix: ['', Validators.required],
    accountSid: ['', [Validators.required]],
    authToken: ['', [Validators.required]],
    notifyServiceId: ['', Validators.required]
  };
  public showSuperPasswordFrom: Boolean = true;
  public isvalidateSuperUserFromSubmitted: Boolean = false;

  constructor(router: Router,private fb: FormBuilder, private userService: UserService, private toastr: ToastrService) { 
    // this.initializeTwilioConfigForm(fb);
  }

  ngOnInit() {
    this.showSuperPasswordFrom = true;
    this.initializeSuperPasswordForm(this.fb)
  }

  initializeSuperPasswordForm(fb) {
    console.log("jtfdsavdhas")
    this.validateUserFrom = fb.group({
      superPassword:['', Validators.required]
    })
  }

  submitSuperPasswordForm() {
    this.isvalidateSuperUserFromSubmitted = true;
    var self= this;
    if(this.validateUserFrom.valid) {
      self.userService.validateUserForSettings(this.validateUserFrom.value)
      .then(status => {
        if(status) {
          self.toastr.success("Successfully Authenticated to Access Page!");
          self.showSuperPasswordFrom = false;
          self.initializeTwilioConfigForm(this.fb);
          self.getTwilioConfigSettings()
        } else {
          self.toastr.error("User Not Allowed to Access this Page!");
        }
      }).catch(err => {
        self.toastr.error(err.message);  
      })
    }
  }
  
  initializeTwilioConfigForm(fb) {
    this.settingsForm = fb.group(this.settingsFormFields);
  }

  getTwilioConfigSettings() {
    var self = this;
    this.userService.getTwilioSetting()
    .then(res => {
      console.log(res)
      self.settingsForm.patchValue({
        id:res.data.id,
        accountSid: res.data.accountSid,
        authToken: res.data.authToken,
        cellPhonePrefix: res.data.cellPhonePrefix,
        notifyServiceId: res.data.notifyServiceId
      })
    })
    .catch(err => {
      self.toastr.error(err.message);  
    })
  }

  submitForm() {
    this.isFormSubmitted = true;
      if(this.settingsForm.valid){
        let self=this;
        self.userService.changeSettings(this.settingsForm.value).then(function(status){
          if(status == true){
            self.toastr.success("Settings have been updated Successfully!");      
          }else{
             self.toastr.error("Sorry! Settings cannot be saved.");      
          }
        })
      }
  }
  resetForm() {
    this.settingsForm.reset();
    this.isFormSubmitted = false;

}
}
