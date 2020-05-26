import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ValidationUtil } from '../../../util/validation.util';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public isFormSubmitted = false;
  public changePasswordForm: FormGroup;
  public showPasswordHint:boolean=false;
  public status = false;
  public changePasswordFormFields = {
    currentPassword: ['', Validators.required],
    password: ['', [Validators.required],ValidationUtil.validatePasswordPattern],
    confirmPassword: ['', [Validators.required]]
  }

  constructor(router: Router, fb: FormBuilder, private userService: UserService, private toastr: ToastrService) { 
    this.initializeChangePasswordForm(fb);
  }

  ngOnInit() {
  }

  initializeChangePasswordForm(fb) {
    this.changePasswordForm = fb.group(this.changePasswordFormFields,{
      validator: ValidationUtil.comparePasswords
    });
  }

  submitForm() {
    this.isFormSubmitted = true;
      if(this.changePasswordForm.valid){
        let currentPassword=this.changePasswordForm.value.currentPassword;
        let password= this.changePasswordForm.value.password;
        let self=this;
        // self.authService.changePassword(currentPassword, password).then(function(status){
          if(this.status == true){
            // Scroll to Top
            self.toastr.success("Password Changed Successfully!");      
          }else{
             self.toastr.error("Incorrect Current Password!");      
          }
          //Reset the form
          self.resetForm();
        // });
      }
  }
  resetForm() {
    this.changePasswordForm.reset();
    this.changePasswordForm.value.password = '';
    this.isFormSubmitted = false;
  }

}
