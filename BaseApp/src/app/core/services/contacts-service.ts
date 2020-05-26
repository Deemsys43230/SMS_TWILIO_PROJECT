import { Injectable } from '@angular/core';
import { ContactsDataService } from '../http/contacts-api-service';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private contactsDataService: ContactsDataService) { }

    //search Individual contatct based on name and phonenumber policy
    searchIndividualContact(data:any): any {
      return this.contactsDataService.searchIndividualContact(data).map(function (res) {
        res.data.forEach(element => {
          element['nameAndPhoneNumber'] = element.name+''+element.phoneNumber
        });
        console.log(res);
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
