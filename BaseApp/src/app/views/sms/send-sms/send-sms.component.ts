import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactsService } from '../../../core/services/contacts-service';
import { ToastrService } from 'ngx-toastr';
import { SmsService } from '../../../core/services/sms-service';
import { TemplateService } from '../../../core/services/template-service';
import { NgxSpinnerService } from "ngx-spinner";


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
  templateData: any = [];
  templateTitle: string = '';

  constructor(private contactsService: ContactsService, private smsService: SmsService, private toastr: ToastrService, private templeteService: TemplateService, private spinner: NgxSpinnerService) { }

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

  patchTemplete(selectedtemplate) {
    this.templateTitle = selectedtemplate.title;
    this.message = selectedtemplate.template;
  }

  sendSMS() {
    var self = this;
    var data;
    this.spinner.show()
    if (this.message.trim() == '') {
      this.toastr.error('Please select a template', 'Send SMS')
      self.spinner.hide()
      return
    };

    if (this.searchType == 'Individual') {
      var userIdArray = this.selectedIndividuals.map(eachindv => eachindv.userId)
      if (userIdArray.length == 0) {
        this.toastr.error('Please select a contact', 'Send SMS');
        self.spinner.hide()
        return
      }
      data = {
        "messageBody": this.message,
        "smsSendIds": userIdArray
      }
      this.smsService.sendIndividualSMS(data).then(function (res) {
        self.spinner.hide()
        if (res.status) {
          self.toastr.success(res.message, 'Send SMS');
          self.reset();
        }
      })
    }

    if (this.searchType == 'Group') {
      var groupIdArray = this.selectedGroups.map(eachindv => eachindv.groupId)
      if (groupIdArray.length == 0) {
        this.toastr.error('Please select a group', 'Send SMS');
        self.spinner.hide()
        return
      }
      data = {
        "messageBody": this.message,
        "groupIds": groupIdArray
      }
      this.smsService.sendGroupSMS(data).then(function (res) {
        self.spinner.hide()
        if (res.status) {
          self.reset()
          self.toastr.success(res.message, 'Send SMS');
        } else {
          self.toastr.error('Please try again later', 'Send SMS');
        }
      })
    }

    
  }

  reset() {
    this.message = '';
    this.templateTitle = "";
    this.searchType == 'Individual' ? this.selectedIndividuals = [] : this.selectedGroups = [];
  }

  getTempletes(){
    var self =this;
    this.templeteService.getAllTemplates().then(function(res){
      if(res.status){
        self.templateData = res.data;
      }
    })
  }

}
