import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  createLoginForm = {
    userName: ["", Validators.required],
    password: ["", Validators.required]
  }
  public isFormSubmitted = false;
  //Activate Forms
  public loginForm: FormGroup;
  //Navigation Router
  public router: Router;

  public hideLoader = true;


  //public login: LoginModel;
  constructor(fb: FormBuilder, router: Router, private userService: UserService, private toastr: ToastrService) {
    //Inject Router
    this.router = router;
    //InitializeForm
    this.initializeLoginForm(fb);
  }
  ngOnInit() {
    localStorage.clear();
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
          if (res.status) {
            localStorage.setItem('isLogin','true');
            localStorage.setItem('Authorization-Token', res.token);
            self.toastr.success("Successfully Logged In");
            self.router.navigate(["user"]);
          }
          else{
            self.hideLoader = true;
            self.toastr.error(res.message);
          }
      }, function (err) {
        self.hideLoader = true;
        self.toastr.error("Something went Wrong! Try again");
      })
    }
  }

}
