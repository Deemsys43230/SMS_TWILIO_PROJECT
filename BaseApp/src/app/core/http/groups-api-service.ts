import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class GroupDataService{

    constructor(private httpClient:HttpClient){}
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

      // Get All Groups
    getAllGroups():Promise<any> {
        return this.httpClient.get("/user/groups").toPromise()
        .then(function (res) {
          return res
        }, function (err) {
          return {
            "Error Message": "Something went to wrong",
            "Error": err
          }
        })
      }
  
      //Get Group By Id
      getGroupById(groupId):Promise<any> {
        return this.httpClient.get("/user/groups/"+groupId).toPromise()
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