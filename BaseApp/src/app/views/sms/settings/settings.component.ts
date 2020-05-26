import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ValidationUtil } from '../../../util/validation.util';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public isFormSubmitted = false;
  public settingsForm: FormGroup;
  public status = false;
  public settingsFormFields = {
    phoneNumber: ['', Validators.required, ValidationUtil.validateMobile],
    accountSid: ['', [Validators.required]],
    accountToken: ['', [Validators.required]]
  }

  constructor(router: Router, fb: FormBuilder, private userService: UserService, private toastr: ToastrService) { 
    this.initializeChangePasswordForm(fb);
  }

  ngOnInit() {
  }

  initializeChangePasswordForm(fb) {
    this.settingsForm = fb.group(this.settingsFormFields);
  }

  submitForm() {
    this.isFormSubmitted = true;
      if(this.settingsForm.valid){
        let self=this;
        // self.userService.changeSettings(settingsForm.value).then(function(status){
          if(this.status == true){
            self.toastr.success("Settings have been changed Successfully!");      
          }else{
             self.toastr.error("Sorry! Settings cannot be saved.");      
          }
          self.resetForm();
      }
  }
  resetForm() {
    this.settingsForm.reset();
    this.isFormSubmitted = false;

}
}
