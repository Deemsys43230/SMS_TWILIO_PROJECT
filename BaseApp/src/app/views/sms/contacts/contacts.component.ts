import { Component, OnInit, Optional } from '@angular/core';
import $ from 'jquery';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ContactsService } from '../../../core/services/contacts-service';
import { DataSharingService } from '../../../core/services/data-sharing-service';
import { Router } from '@angular/router';
import { ValidationUtil } from '../../../util/validation.util';
import { ToastrService } from 'ngx-toastr';
import { GroupsService } from '../../../core/services/groups-service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: $;

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  public contacts = [];
  public contactsCopy = [];
  public groups = [];
  public groupsCopy = [];
  public deleteRecordType;
  public deleteRecordId;
  public updateUserId = null;
  public contactForm: FormGroup;
  public isContactFormSubmitted;
  public selectedContacts = [];
  public singlecontactToGroup = null;

  constructor(private fb: FormBuilder, private contactsService: ContactsService, private groupsService: GroupsService,
    private dataSharingService: DataSharingService, private router: Router, private ngxToaster: ToastrService, private spinner: NgxSpinnerService) {
    this.getContacts(); this.initializeContactForm(); this.getGroups();
  }

  ngOnInit() { }

  //initialize contact form
  initializeContactForm() {
    this.contactForm = this.fb.group(
      {
        name: ['', Validators.required],
        phoneNumber: ['', [Validators.required], ValidationUtil.validateMobile],
        email: ['', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
      })
  }

  //Get Contacts from backend
  getContacts() {
    this.spinner.show()
    var self = this;
    this.contactsService.getAllContacts().then((res) => {
      self.contacts = res.data;
      self.contactsCopy = JSON.parse(JSON.stringify(this.contacts));
      self.contacts = Object.values(this.groupBy(this.contacts, 'name'));
      self.spinner.hide()
    }, (err) => {
      self.spinner.hide()
      self.ngxToaster.error("Unknown Error Occured")
    })
  };

  //Add New Contact
  addContact() {
    this.isContactFormSubmitted = true;
    if (this.contactForm.valid) {
      this.spinner.show()
      var self = this;
      this.contactsService.addContact(this.contactForm.value).then(function (res) {
        self.spinner.hide()
        if (res.status) {
          self.getContacts();
          self.initializeContactForm();
          $('#addContactModal').modal('hide');
          self.ngxToaster.success('Contact added Successfully');
        }
        else {
          self.ngxToaster.error(res.err.message);
        }
      }, function (err) {
        self.spinner.hide()
        self.ngxToaster.error("Unknown Error Occured")
      })
    }
  }

  //Add New Contact
  updateContact() {
    this.isContactFormSubmitted = true;
    if (this.contactForm.valid) {
      this.spinner.show()
      var self = this;
      this.contactsService.updateContact(this.updateUserId, this.contactForm.value).then(function (res) {
        self.spinner.hide()
        if (res.status) {
          self.getContacts();
          self.initializeContactForm();
          self.updateUserId = null;
          $('#addContactModal').modal('hide');
          self.ngxToaster.success('Contact updated Successfully');
        }
        else {
          self.ngxToaster.error(res.err.message);
        }
      }, function (err) {
        self.spinner.hide()
        self.ngxToaster.error("Unknown Error Occured")
      })
    }
  }

  doDeleteRecord() {
    var self = this;
    this.spinner.show()
    this.contactsService.deleteContact(this.deleteRecordType, this.deleteRecordId).then(function (res) {
      self.spinner.hide()
      self.getContacts();
      self.getGroups();
      $('#deleteModal').modal('hide');
      self.ngxToaster.success('Record Deleted Successfully')
    }, function (err) {
      self.spinner.hide()
      self.ngxToaster.error("Unknown Error Occured")
    })

  }

  //Get groups list from backend
  getGroups() {
    var self = this;
    this.spinner.show()
    this.groupsService.getAllGroups().then(function (res) {
      self.spinner.hide()
      self.groups = res.data;
      self.groupsCopy = JSON.parse(JSON.stringify(self.groups));
    }, function (err) {
      self.spinner.hide()
      self.ngxToaster.error("Unknown Error Occured")
    })
  }

  /*   Navigate to add-edit group page */
  editGroup(group) {
    this.router.navigate(['/user/contacts/add-edit-group', group.groupId])
  }

  //Checkbox multiple select contacts for sending sms and add to groups
  selectContact(contact) {
    if (contact.checked)
      this.selectedContacts.push(contact);
    else {
      this.selectedContacts = this.selectedContacts.filter(function (e) {
        return e.userId !== contact.userId;
      });
    }
  }

  //Search through contacts (Local search)
  searchContacts(value) {
    this.contacts = this.contactsCopy.filter(function (obj) {
      return Object.keys(obj)
        .some(function (k) {
          if (k == "name" || k == "phoneNumber")
            return obj[k].toLowerCase().indexOf(value.toLowerCase()) !== -1;
        });
    });
    this.contacts = Object.values(this.groupBy(this.contacts, 'name'));
  }

  //Search through groups (Local Search)
  searchGroups(value) {
    this.groups = this.groupsCopy.filter(function (obj) {
      return Object.keys(obj)
        .some(function (k) {
          if (k == "groupName")
            return obj[k].toLowerCase().indexOf(value.toLowerCase()) !== -1;
        });
    });
  }

  //Group by alphabets functionality for contacts
  groupBy = function (array, key) {
    return array.reduce((r, e) => {
      // get first letter of name of current element
      let group = e[key][0].toUpperCase();
      // if there is no property in accumulator with this letter create it
      if (!r[group]) r[group] = { group, children: [e] }
      // if there is push current element to children array for that letter
      else r[group].children.push(e);
      // return accumulator
      return r;
    }, {})
  };

  /* open contact modal on add */
  addContactModal() {
    this.updateUserId = null;
    this.initializeContactForm();
    this.isContactFormSubmitted = false;
    $('#addContactModal').modal('show');
  }

  /* open contact modal on edit */
  editContactModal(record) {
    this.updateUserId = record.userId;
    this.initializeContactForm();
    this.contactForm.patchValue({
      name: record.name,
      phoneNumber: record.phoneNumber,
      email: record.email
    })
    this.isContactFormSubmitted = false;
    $('#addContactModal').modal('show');
  }

  openDeleteModal(recordType, userId) {  /* recordType = 1->(contact) , 2->(group) */
    this.deleteRecordType = recordType,
      this.deleteRecordId = userId;
    $('#deleteModal').modal('show');
  }

  AddMultipleUsersToGroupModal() {
    this.singlecontactToGroup = null;
    $('#AddUsersToGroupModal').modal('show');
  }

  AddSingleUserToGroupModal(userId) {
    this.singlecontactToGroup = userId;
    $('#AddUsersToGroupModal').modal('show');
  }

  /*   Add Contacts to Group*/
  addContactToGroup(groupId) {
    let filteredIds
    //pushing id alone for backend
    if (this.singlecontactToGroup != null)
      filteredIds = [this.singlecontactToGroup];
    else
      filteredIds = this.selectedContacts.reduce((array, currenValue) => {
        array.push(currenValue.userId);
        return array;
      }, []);

    var self = this;
    this.groupsService.addContactsToGroup(groupId, filteredIds).then(function (res) {
      self.spinner.hide()
      if (res.message.code == 103) {
        self.ngxToaster.error(res.message.msg);
      }
      else {
        $('#AddUsersToGroupModal').modal('hide');
        self.ngxToaster.success(res.message.msg);
        self.selectedContacts = [];
        self.singlecontactToGroup = null;
        self.getContacts(); self.getGroups();
      }
    })
  }

  /* Navigate to send sms page with data */
  sendSms(recipients_type: Number, recipients) {
    if (recipients_type == 1) /* SingleContact */ {
      if (!Array.isArray(recipients))
        recipients = [recipients];
      this.dataSharingService.nextData({ recipientType: 'Individual', recipients: recipients })
    }
    else {
      recipients = [recipients];
      this.dataSharingService.nextData({ recipientType: 'Group', recipients: recipients })
    }
    this.router.navigate(['/user/send-sms']);
  }
}
