import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserApiService } from '../../../core/http/user-api-service';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
//import { UserService } from '../../../services/user.service';
//import { LoginModel } from '../../../models/login.model';
//import { FlashMessageService } from '../../flash-message/flash-message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  createLoginForm = {
    username: ["", Validators.required],
    password: ["", Validators.required]
  }
  public isFormSubmitted = false;
  //Activate Forms
  public loginForm: FormGroup;
  //Navigation Router
  public router: Router;

  public hideLoader = true;


  //public login: LoginModel;
  constructor(fb: FormBuilder, router: Router, private userService: UserApiService, private toastr: ToastrService) {
    //Inject Router
    this.router = router;
    //InitializeForm
    this.initializeLoginForm(fb);
  }
  ngOnInit() {

  }
  //Initialize Form
  initializeLoginForm(fb) {
    this.loginForm = fb.group(this.createLoginForm)
  }

  //   //On Form Submit
  onSubmitForm() {
    this.isFormSubmitted = true;
    if (this.loginForm.valid) {
      var self = this;
      self.hideLoader = false;
      this.userService.login(this.loginForm.value).then(function (res) {
        if (res.err) {
          self.hideLoader = true;
          self.toastr.error(res.err.message);
        }
        else if (res.data) {
          localStorage.setItem('isLogin','true');
          localStorage.setItem('Authorization-Token', res.data.token);
          self.toastr.success("Successfully Logged In");
          if (res.data.role == "ROLE_BILLER") {
            self.router.navigate(['biller']);
          }
          else if (res.data.role == "ROLE_CADMIN") {
            self.router.navigate(['clinic']);
          }
        }

      }, function (err) {
        self.hideLoader = true;
        self.toastr.error("Invalid Credentials");
      })
    }
  }

}
