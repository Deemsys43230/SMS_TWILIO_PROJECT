import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsDataService {

  constructor(private httpClient: HttpClient) { }

  //search Individual contatct based on name and phonenumber policy
  searchIndividualContact(data:any): Observable<any> {
    return this.httpClient.post("/user/contacts/search/users", data)
    .map(function (res) {
      return res
    }, function (err) {
      return {
        "Error Message": "Something went to wrong",
        "Error": err
      }
    })
  }

    // Get All contacts
    getAllContacts():Promise<any> {
      return this.httpClient.get("/user/contacts").toPromise()
      .then(function (res) {
        return res
      }, function (err) {
        return {
          "Error Message": "Something went to wrong",
          "Error": err
        }
      })
    }

    // Get contact by contact Id
    getContactById(userId):Promise<any> {
      return this.httpClient.get("/user/contacts/"+userId).toPromise()
      .then(function (res) {
        return res
      }, function (err) {
        return {
          "Error Message": "Something went to wrong",
          "Error": err
        }
      })
    }

    // Add contact
    addContact(data):Promise<any> {
      return this.httpClient.post("/user/contacts",data).toPromise()
      .then(function (res) {
        return res
      }, function (err) {
        return {
          "Error Message": "Something went to wrong",
          "Error": err
        }
      })
    }

    // Add contact
    updateContact(userId,data):Promise<any> {
      return this.httpClient.put("/user/contacts/"+userId,data).toPromise()
      .then(function (res) {
        return res
      }, function (err) {
        return {
          "Error Message": "Something went to wrong",
          "Error": err
        }
      })
    }

    //Delete Contact
    deleteContact(userId):Promise<any> {
      return this.httpClient.delete("/user/contacts/"+userId).toPromise()
      .then(function (res) {
        return res
      }, function (err) {
        return {
          "Error Message": "Something went to wrong",
          "Error": err
        }
      })
    }

    //upload contact
    uploadContact(data):Promise<any> {
      return this.httpClient.post("/user/contacts/upload/importContacts",data).toPromise()
      .then(function (res) {
        return res
      }, function (err) {
        return {
          "Error Message": "Something went to wrong",
          "Error": err
        }
      })
    }
}
