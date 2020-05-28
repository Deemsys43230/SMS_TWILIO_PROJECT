import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactsService } from '../../../core/services/contacts-service';
import { ToastrService } from 'ngx-toastr';
import { SmsService } from '../../../core/services/sms-service';
import { TemplateService } from '../../../core/services/template-service';
import { NgxSpinnerService } from "ngx-spinner";
import { DataSharingService } from '../../../core/services/data-sharing-service';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupsService } from '../../../core/services/groups-service';


@Component({
  selector: 'app-send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.scss']
})
export class SendSmsComponent implements OnInit, OnDestroy {
  searchType: any = 'Individual';
  selectedIndividuals: any = [];
  selectedGroups: any = [];
  message: string = '';
  public routingType;
  templateData: any = [];
  templateTitle: string = '';
  sharedData: any;

  constructor(private contactsService: ContactsService, private smsService: SmsService, private toastr: ToastrService
    , private router: Router, private ActivatedRoute: ActivatedRoute, private dataSharingService: DataSharingService
    , private spinner: NgxSpinnerService, private templeteService: TemplateService, private groupsService: GroupsService) {

    this.ActivatedRoute.params.subscribe(params => {
      this.routingType = params['routeType'];
    });

    if (this.routingType == 1) {
      this.selectedIndividuals = []; this.selectedGroups = [];
    }
    else {
      this.sharedData = this.dataSharingService.sharedData.subscribe((data) => {
        this.searchType = (data.recipientType == null) ? 'Individual' : data.recipientType;
        data.recipientType == 'Individual' ? this.selectedIndividuals = data.recipients : this.selectedGroups = data.recipients;
        if (data.template != undefined) {
          this.message = data.template.template;
          this.templateTitle = data.template.title;
        }
      })
     }

  }

  ngOnInit() {
  }

  ngOnDestroy(){
    if(this.routingType!=1)
    this.sharedData.unsubscribe()
  }

  public requestAutoCompleteGroup = (text: string): Observable<any> => {
    return this.groupsService.searchGroups({ "name": text })
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

  getTempletes() {
    var self = this;
    this.templeteService.getAllTemplates().then(function (res) {
      if (res.status) {
        self.templateData = res.data;
      }
    })
  }

}
