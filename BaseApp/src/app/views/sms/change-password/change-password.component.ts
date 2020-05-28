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
    newPassword: ['', [Validators.required,Validators.minLength(5)]],
    confirmNewPassword: ['', [Validators.required]]
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
        let self=this;
        self.userService.changePassword(self.changePasswordForm.value).then(function(res){
          if(res.status == true){
            self.resetForm();
            self.toastr.success("Password Changed Successfully!");      
          }else{
             self.toastr.error("Incorrect Current Password!");      
          }
        });
      }
  }
  resetForm() {
    this.changePasswordForm.reset();
    this.changePasswordForm.value.password = '';
    this.isFormSubmitted = false;
  }

}
