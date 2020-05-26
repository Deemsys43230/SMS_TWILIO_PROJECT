import { Injectable } from '@angular/core';
import { SmsApiService } from '../http/sms-api-service';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(private smsAPIService: SmsApiService) { }

  public sendIndividualSMS(contactData: any) {
    return this.smsAPIService.sendIndividualSMS(contactData).then(function (res) {
      return res;
    }, function (err) {
      return err;
    })
  }

  public sendGroupSMS(groupData: any) {
    return this.smsAPIService.sendGroupSMS(groupData).then(function (res) {
      return res;
    }, function (err) {
      return err;
    })
  }

}
