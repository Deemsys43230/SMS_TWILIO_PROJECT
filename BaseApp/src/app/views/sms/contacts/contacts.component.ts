import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ContactsService } from '../../../core/services/contacts-service';
declare var $:$;

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  public contacts;
  public contactsCopy;
  public groups;
  public groupsCopy;
  public contactForm:FormGroup;
  public groupForm:FormGroup;
  public isContactFormSubmitted;
  public isGroupFormSubmitted;
  public selectedContacts=[];

  constructor(private fb:FormBuilder,private contactsService:ContactsService) {
    this.getContacts();this.initializeContactForm();this.initializeGroupForm();this.getGroups();
   }

  ngOnInit() {}
  initializeContactForm(){
    this.contactForm=this.fb.group(
      {
        name:['',Validators.required],
        mobile:['',Validators.required],
        email:['',Validators.required]
      })
  }
  initializeGroupForm(){
    this.groupForm=this.fb.group(
      {
        groupName:['',Validators.required],
        users:[[],Validators.required],

      }
    )
  }

  getContacts(){
      this.contacts=
      [{"name":"Aravinth","mobile":"982827262","email":"aravinth@gmail.com","userId":"128129"},
      {"name":"Aravinth","mobile":"982827262","email":"aravinth@gmail.com","userId":"12813"},
      {"name":"Aravinth","mobile":"982827262","email":"aravinth@gmail.com","userId":"128131"},
      {"name":"Aravinth","mobile":"982827262","email":"aravinth@gmail.com","userId":"128132"},
      {"name":"Balaji","mobile":"982827262","email":"aravinth@gmail.com","userId":"128133"},
      {"name":"Cavin","mobile":"982827262","email":"aravinth@gmail.com","userId":"128134"},
      {"name":"Dravid","mobile":"982827262","email":"aravinth@gmail.com","userId":"128145"},
      {"name":"Elias","mobile":"982827262","email":"aravinth@gmail.com","userId":"128154"},
      {"name":"Lavas","mobile":"982827262","email":"aravinth@gmail.com","userId":"128100"},
      {"name":"Kreates","mobile":"982827262","email":"aravinth@gmail.com","userId":"128123"},
      {"name":"Mano","mobile":"982827262","email":"aravinth@gmail.com","userId":"128142"},
      {"name":"Susi","mobile":"982827262","email":"aravinth@gmail.com","userId":"128110"},
      {"name":"Treat","mobile":"982827262","email":"aravinth@gmail.com","userId":"128100"},
      {"name":"Urvas","mobile":"982827262","email":"aravinth@gmail.com","userId":"121929"},
      {"name":"zeath","mobile":"982827262","email":"aravinth@gmail.com","userId":"018129"},
      {"name":"zeth","mobile":"982827262","email":"aravinth@gmail.com","userId":"110129"}]
      this.contactsCopy=JSON.parse(JSON.stringify(this.contacts));
      this.contacts=Object.values(this.groupBy(this.contacts,'name'));
  };
  getGroups(){
    this.groups=[{
      "groupName":"Group 1",
      "groupId":"182719",
      "users":[
        "152162","1721","178271"]
    },{
      "groupName":"Group 2",
      "groupId":"002719",
      "users":[
        "2162","1721","178271",,"7188901","091100"]
    },{
      "groupName":"Group 3",
      "groupId":"89755",
      "users":[
        "2162","1721","178271",,"7188901","091100","91819","182190"]
    },{
      "groupName":"Group 4",
      "groupId":"023120",
      "users":[
        ,"91819","182190"]
    },{
      "groupName":"Group 5",
      "groupId":"02120",
      "users":[
        "2571","91819","182190"]
    }]
    this.groupsCopy=JSON.parse(JSON.stringify(this.groups));
  }

  selectContact(contact){
    if(contact.checked)
    {
      this.selectedContacts.push(contact);
    }
    else
    {
      this.selectedContacts = this.selectedContacts.filter(function(e){
        return e.userId !== contact.userId;
      });
    }
  }
  searchContacts(value){
    this.contacts=this.contactsCopy.filter(function(obj) {
      return Object.keys(obj)
                   .some(function(k) {
                          if(k=="name" || k=="mobile")
                             return obj[k].toLowerCase().indexOf(value.toLowerCase()) !== -1; 
                         });
  });   
 this.contacts=Object.values(this.groupBy(this.contacts,'name'));
}

searchGroups(value){
  this.groups=this.groupsCopy.filter(function(obj) {
    return Object.keys(obj)
                 .some(function(k) {
                        if(k=="groupName")
                           return obj[k].toLowerCase().indexOf(value.toLowerCase()) !== -1; 
                       });
});   
}
groupBy = function(array, key) {
 return array.reduce((r, e) => {
    // get first letter of name of current element
    let group = e[key][0];
    // if there is no property in accumulator with this letter create it
    if(!r[group]) r[group] = {group, children: [e]}
    // if there is push current element to children array for that letter
    else r[group].children.push(e);
    // return accumulator
    return r;
  }, {})
};

addContactModal(){
  this.initializeContactForm();
  this.isContactFormSubmitted=false;
  $('#addContactModal').modal('show');
}
addGroupModal(){
  this.initializeContactForm();
  this.isGroupFormSubmitted=false;
  $('#addGroupModal').modal('show');
}
}
