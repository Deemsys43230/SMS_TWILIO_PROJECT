import { Injectable } from '@angular/core';
import { UserApiService } from '../http/user-api-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private userApiService : UserApiService) { }
  
  public changeSettings(data){
    return this.userApiService.changeSettings(data).then(function(res){
      return res.status;
    },
    function(err){
      return err;
    })
  }

  public getTwilioSetting() {
    return this.userApiService.getTwilioSetting().then(function(res){
      return res;
    },
    function(err){
      return err;
    })
  }

  public validateUserForSettings(data) {
    return this.userApiService.validateUserForSettings(data).then(function(res){
      return res.status;
    },
    function(err){
      return err;
    })
  }

  //Change Password
public changePassword(data){
  return this.userApiService.changePassword(data).then(function(res){
    return res;
  },
  function(err){
    return err
  })
}

public login(loginData:any){
  return this.userApiService.login(loginData).then(function(res){
      return res;
  },function(err){
      return err;
  })
}
}
