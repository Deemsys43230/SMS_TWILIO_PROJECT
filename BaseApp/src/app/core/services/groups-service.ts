import { Injectable } from "@angular/core";
import { GroupDataService } from "../http/groups-api-service";


@Injectable({
    providedIn:'root'
})
export class GroupsService{

    constructor(private groupDataService:GroupDataService){}

    //search Groups based on name  policy
    searchGroups(data:any): any {
        return this.groupDataService.searchGroups(data).map(function (res) {
          return res;
        }, function (err) {
          return err;
        })
      }


      //Get All Group List
    getAllGroups():any{
        return this.groupDataService.getAllGroups().then(function(res){
          return res;
        },function(err){
          return err;
        })
      }
  
      //Get Group By Id
      getGroupById(groupId):any{
        return this.groupDataService.getGroupById(groupId).then(function(res){
          return res;
        },function(err){
          return err;
        })
      }
}