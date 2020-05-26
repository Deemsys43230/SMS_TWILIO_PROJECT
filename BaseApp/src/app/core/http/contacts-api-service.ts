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

    //search Groups based on name  policy
    searchGroups(data:any): Observable<any> {
      return this.httpClient.post("/user/groups/search/groups", data)
      .map(function (res) {
        return res
      }, function (err) {
        return {
          "Error Message": "Something went to wrong",
          "Error": err
        }
      })
    }
}
