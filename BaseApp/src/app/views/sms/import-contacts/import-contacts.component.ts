import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactsService } from '../../../core/services/contacts-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-import-contacts',
  templateUrl: './import-contacts.component.html',
  styleUrls: ['./import-contacts.component.scss']
})
export class ImportContactsComponent implements OnInit {

  public fileForm:FormGroup;
  public isValidFileFormat=true;
  public isFormSubmitted=false;
  fileToUpload: File = null;
  showErrorDiv=false;
  uploadErrors=[];
  public fileUploadLabelText = "Select File...";
  constructor(private fb:FormBuilder,private contactService:ContactsService,private toaster:ToastrService,
    private router:Router,private spinner: NgxSpinnerService) {
    this.initializeFileForm();
   }

   initializeFileForm()
   {
     this.fileForm=this.fb.group(
       {
         file:['',Validators.required]
       }
     )
   }

   ngOnInit() {}

   handleFileInput(files){
    this.isValidFileFormat = true;
    let ValidFormats = ['csv'];
    this.fileToUpload = files.item(0);
    if (!this.fileToUpload) {
      this.fileUploadLabelText = "Select File..."
    }
    else {
      let file = files.item(0);
      this.fileUploadLabelText = file.name;
      let ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      if (ValidFormats.indexOf(ext) == -1) {
        this.isValidFileFormat = false;
        this.fileUploadLabelText = "Select File...";
      }
   }
  }

  UploadContacts(){
    this.isFormSubmitted=true;
    if(this.fileForm.valid && this.isValidFileFormat){
      this.spinner.show();
      const uploadData = new FormData();
      uploadData.append('file', this.fileToUpload, this.fileToUpload.name);
      var self=this;
      this.contactService.uploadContacts(uploadData).then(function(res){
        self.spinner.hide()
        if(!res.status){
          if(res.err && res.err.code)
          {
            self.toaster.error(res.err.message);
          }
          else
          {
            self.showErrorDiv=true;
            self.uploadErrors=res.err;
          }
        }else{
          self.toaster.success('Contacts Imported Successfully');
          self.router.navigate(['/user/contacts']);
        }
      },function(err){
        self.spinner.hide()
        console.log(err);
      })
    }
  }

  onResetForm() {
    this.initializeFileForm();
    this.isFormSubmitted = false;
    this.fileUploadLabelText = "Select File...";
    this.showErrorDiv=false;
    this.uploadErrors=[];
  }
}
