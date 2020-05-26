import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactsService } from '../../../core/services/contacts-service';
import { SmsService } from '../../../core/services/sms.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.scss']
})
export class SendSmsComponent implements OnInit {
  searchType: any = 'Individual';
  selectedIndividuals: any = [];
  selectedGroups: any = [];
  message: string = '';

  constructor(private contactsService: ContactsService, private smsService: SmsService, private toastr: ToastrService) { }

  ngOnInit() {
  }

  public requestAutoCompleteGroup = (text: string): Observable<any> => {
    return this.contactsService.searchGroups({ "name": text })
      .map((res: any) => res.data);
  };

  public requestAutoCompleteIndividual = (text: string): Observable<any> => {
    return this.contactsService.searchIndividualContact({ "searchText": text })
      .map((res: any) => res.data);
  };

  onSelect(event: any) {
    console.log(this.selectedIndividuals, 'this.selected', event, this.selectedGroups);
  }

  removeIndividual(item) {
    this.selectedIndividuals.splice(this.selectedIndividuals.indexOf(item), 1);
  }

  removeGroup(item) {
    this.selectedGroups.splice(this.selectedIndividuals.indexOf(item), 1);
  }

  patchTemplete() {
    this.message = 'hi this is a sample message';
  }

  sendSMS() {
    var self = this;
    var data;
    if (this.message.trim() == '') return this.toastr.error('Please select a template', 'Send SMS');

    if (this.searchType == 'Individual') {
      var userIdArray = this.selectedIndividuals.map(eachindv => eachindv.userId)
      if (userIdArray.length == 0) return this.toastr.error('Please select a contact', 'Send SMS');
      data = {
        "messageBody": this.message,
        "smsSendIds": userIdArray
      }
      this.smsService.sendIndividualSMS(data).then(function (res) {
        if (res.status) {
          self.reset();
        }
      })
    }

    if (this.searchType == 'Group') {
      var groupIdArray = this.selectedGroups.map(eachindv => eachindv.groupId)
      if (groupIdArray.length == 0) return this.toastr.error('Please select a group', 'Send SMS');
      data = {
        "messageBody": this.message,
        "groupIds": groupIdArray
      }
      this.smsService.sendGroupSMS(data).then(function (res) {
        if (res.status) {
          self.reset()
        }
      })
    }
  }

  reset() {
    this.message = '';
    this.searchType == 'Individual' ? this.selectedIndividuals = [] : this.selectedGroups = [];
  }

}
