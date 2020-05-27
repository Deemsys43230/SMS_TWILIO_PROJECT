import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupDataService {

  constructor(private httpClient: HttpClient) { }
  //search Groups based on name  policy
  searchGroups(data: any): Observable<any> {
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
  getAllGroups(): Promise<any> {
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
  getGroupById(groupId): Promise<any> {
    return this.httpClient.get("/user/groups/" + groupId).toPromise()
      .then(function (res) {
        return res
      }, function (err) {
        return {
          "Error Message": "Something went to wrong",
          "Error": err
        }
      })
  }

  //search Groups based on name  policy
  addGroup(data: any):  Promise<any> {
    return this.httpClient.post("/user/groups", data).toPromise()
      .then(function (res) {
        return res
      }, function (err) {
        return {
          "Error Message": "Something went to wrong",
          "Error": err
        }
      })
  }

  //update group by id
  updateGroupById(data: any, id: any): Promise<any> {
    return this.httpClient.put("/user/groups/" + id, data).toPromise()
      .then(function (res) {
        return res
      }, function (err) {
        return {
          "Error Message": "Something went to wrong",
          "Error": err
        }
      })
  }

  deleteGroup(groupId): Promise<any> {
    return this.httpClient.delete("/user/groups/"+groupId).toPromise()
      .then(function (res) {
        return res
      }, function (err) {
        return {
          "Error Message": "Something went to wrong",
          "Error": err
        }
      })
  }

      addContactsToGroup(groupId,users):Promise<any>{
        return this.httpClient.post("/user/groups/addToGroup",{"groupId":groupId,"contactIds":users}).toPromise()
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