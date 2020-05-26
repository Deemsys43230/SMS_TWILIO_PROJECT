import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SmsApiService {

  constructor(private httpClient: HttpClient) { }

  public sendIndividualSMS(data: any): Promise<any> {
    return this.httpClient.post('/user/contacts/sms/users', data).toPromise()
      .then(function (res) {
        return res;
      }, function (err) {
        return err;
      })
  }

  public sendGroupSMS(data: any): Promise<any> {
    return this.httpClient.post('/user/contacts/sms/group', data).toPromise()
      .then(function (res) {
        return res;
      }, function (err) {
        return err;
      })
  }

}
