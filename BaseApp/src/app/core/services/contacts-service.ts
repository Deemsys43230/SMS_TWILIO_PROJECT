import { Injectable } from '@angular/core';
import { ContactsDataService } from '../http/contacts-api-service';
import { GroupDataService } from '../http/groups-api-service';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private contactsDataService: ContactsDataService,private groupDataService:GroupDataService) { }

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

    

    //Get All contact List
    getAllContacts():any{
      return this.contactsDataService.getAllContacts().then(function(res){
        return res;
      },function(err){
        return err;
      })
    }

    getContactById(userId):any {
      return this.contactsDataService.getContactById(userId).then(function(res){
      return res;
      },function(err){
        return err;
      })
    }

    addContact(data):any {
      return this.contactsDataService.addContact(data).then(function(res){
        return res;
        },function(err){
          return err;
        }) 
    }

    updateContact(userId,data):any{
      return this.contactsDataService.updateContact(userId,data).then(function(res){
        return res;
        },function(err){
          return err;
        }) 
    }

    deleteContact(recordType,id):any{
      if(recordType==1){ /* contact delete */
        return this.contactsDataService.deleteContact(id).then(function(res){
          return res;
          },function(err){
            return err;
          }) 
      }
      else
      { /* Group Delete */
        return this.groupDataService.deleteGroup(id).then(function(res){
          return res;
          },function(err){
            return err;
          }) 
      }
      
    }

    uploadContacts(data){
      return this.contactsDataService.uploadContact(data).then(function(res){
        return res;
        },function(err){
          return err;
        }) 
    }

}
