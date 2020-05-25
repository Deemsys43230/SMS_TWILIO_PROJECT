import { Injectable } from '@angular/core';
import { ContactsDataService } from './contacts.data.service';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private contactsDataService: ContactsDataService) { }

    //search Individual contatct based on name and phonenumber policy
    searchIndividualContact(data:any): any {
      return this.contactsDataService.searchIndividualContact(data).map(function (res) {
        return res;
      }, function (err) {
        return err;
      })
    }

    //search Groups based on name  policy
    searchGroups(data:any): any {
      return this.contactsDataService.searchGroups(data).map(function (res) {
        return res;
      }, function (err) {
        return err;
      })
    }
}
