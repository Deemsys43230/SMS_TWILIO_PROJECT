import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../../../core/services/contacts-service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupsService } from '../../../core/services/groups-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {

  public groupId;
  headerText: string = 'Add';

  constructor(private contactsService: ContactsService, private route: ActivatedRoute, private groupsService: GroupsService, private toastr: ToastrService, private router: Router) {
    this.route.params.subscribe((params) => {
      this.groupId = params['groupId'];
      if (this.groupId != 1) {
        this.getGroupById();
        this.headerText = 'Edit';
      } else {
        this.headerText = 'Add';
      }

    })
  }

  public groupDetails = {
    groupName: '',
    selectedIndividuals: []
  }

  getGroupById() {
    var self = this;
    this.groupsService.getGroupById(this.groupId).then(function (res) {
      self.groupDetails = {
        groupName: res.data[0].groupName,
        selectedIndividuals: res.data[0].users
      }
    }, function (err) {
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

  addGroup() {
    if (this.groupDetails.groupName.trim() != "" && this.groupDetails.selectedIndividuals.length != 0) {
      this.groupDetails['users'] = this.groupDetails.selectedIndividuals.map(indv => indv.userId);
      var self = this;
      this.groupsService.addGroup(this.groupDetails).then(function (res) {
        if (res.status) {
          self.toastr.success(res.message, self.headerText + ' Group')
          self.reset();
          self.router.navigate(['/user/contacts']);
        }
      })
    } else {
      this.toastr.error('Please make sure to add groupname and contacts', this.headerText + ' Group')
    }

  }


  updateGroup() {
    if (this.groupDetails.groupName.trim() != "" && this.groupDetails.selectedIndividuals.length != 0) {
      this.groupDetails['users'] = this.groupDetails.selectedIndividuals.map(indv => indv.userId);
      var self = this;
      this.groupsService.updateGroupById(this.groupDetails,this.groupId).then(function (res) {
        if (res.status) {
          self.toastr.success(res.message, self.headerText + ' Group')
          self.reset();
          self.router.navigate(['/user/contacts']);
        }
      })
    } else {
      this.toastr.error('Please make sure to add groupname and contacts', this.headerText + ' Group')
    }

  }

  reset() {
    this.groupDetails = {
      groupName: '',
      selectedIndividuals: []
    }
  }

}
