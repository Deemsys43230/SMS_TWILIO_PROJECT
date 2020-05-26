import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../../../core/services/contacts-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {

  constructor(private contactsService:ContactsService) { }

  public groupDetails={
    groupName:'',
    selectedIndividuals:[]
  }
  ngOnInit() {
  }

  public requestAutoCompleteIndividual = (text: string): Observable<any> => {
    return this.contactsService.searchIndividualContact({ "searchText": text })
      .map((res: any) => res.data);
  };

}
