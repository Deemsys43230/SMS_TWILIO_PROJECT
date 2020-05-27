import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../../../core/services/contacts-service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GroupsService } from '../../../core/services/groups-service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {

  public groupId;

  constructor(private contactsService:ContactsService,private route:ActivatedRoute,private groupsService:GroupsService) { 
    this.route.params.subscribe((params)=>{
      this.groupId=params['groupId'];
      if(this.groupId!=1)
      this.getGroupById();
    })
  }

  public groupDetails={
    groupName:'',
    selectedIndividuals:[]
  }

  getGroupById(){
    var self=this;
    this.groupsService.getGroupById(this.groupId).then(function(res){
     self.groupDetails={
       groupName:res.data[0].groupName,
       selectedIndividuals:res.data[0].users
     }
    },function(err){
      console.log(err);
    })
  }

  ngOnInit() {
  }

  public requestAutoCompleteIndividual = (text: string): Observable<any> => {
    return this.contactsService.searchIndividualContact({ "searchText": text })
      .map((res: any) => res.data);
  };

  onSelect(event: any) {
    console.log(this.groupDetails.selectedIndividuals);
  }

  removeIndividual(item) {
    this.groupDetails.selectedIndividuals.splice(this.groupDetails.selectedIndividuals.indexOf(item), 1);
  }

}
