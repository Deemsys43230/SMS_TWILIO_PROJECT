import { Component, OnInit } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { ContactsService } from '../../../core/services/contacts.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.scss']
})
export class SendSmsComponent implements OnInit {
  searchType: any = 'Individual';
  selectedIndividuals: any = [];
  selectedGroups: any = [];

  constructor(private contactsService: ContactsService) { }

  ngOnInit() {
  }

  changeClass(event, type) {
    var element;
    type == "Individual" ? element = document.getElementById('GroupSms') : element = document.getElementById('Individual')
    this.searchType = type;
    event.target.classList.toggle('btn-outline-primary');
    event.target.classList.toggle('btn-primary');
    console.log(element);
    element.classList.remove('btn-primary');
    element.classList.add('btn-outline-primary');
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
    console.log(this.selectedIndividuals, 'this.selected', event,this.selectedGroups);
  }
}
