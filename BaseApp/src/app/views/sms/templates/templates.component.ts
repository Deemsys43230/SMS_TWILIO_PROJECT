import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../../../core/services/template-service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import $ from "jquery";
declare var $: $;

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {
  templateTitle: string = '';
  templateMessage: string = '';
  templateButtonText: string = 'Add';
  templateData: any = [];
  templateUpdateId: any;
  templateDeleteId: any;
  searchData: any = [];

  constructor(private templeteService: TemplateService, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getTempletes();
  }


  getTempletes() {
    var self = this;
    this.templeteService.getAllTemplates().then(function (res) {
      if (res.status) {
        self.templateData = res.data;
        self.searchData = JSON.parse(JSON.stringify(self.templateData));

      }
    })
  }

  addTemplates() {
    this.spinner.show();
    if (this.templateTitle.trim() != '' && this.templateMessage.trim() != '') {
      var self = this;
      var data = {
        "title": this.templateTitle,
        "template": this.templateMessage
      }
      this.templeteService.addTemplate(data).then(function (res) {
        self.spinner.hide();
        if (res.status) {
          self.reset();
          self.getTempletes();
          self.toastr.success(res.message, 'Send SMS');
        }
      })
    } else {
      this.spinner.hide();
      this.toastr.error('Please make sure to enter title and templete', 'Templete');
    }
  }

  reset() {
    this.templateTitle = '';
    this.templateMessage = '';
    this.templateButtonText = 'Add';
    this.templateUpdateId = '';
  }

  editTemplate(selectedTemplate) {
    this.templateButtonText = 'Update';
    this.templateUpdateId = selectedTemplate.templateId;
    this.templateMessage = selectedTemplate.template;
    this.templateTitle = selectedTemplate.title;
  }

  updateTemplate() {
    this.spinner.show();
    if (this.templateTitle.trim() != '' && this.templateMessage.trim() != '') {
      var self = this;
      var data = {
        "title": this.templateTitle,
        "template": this.templateMessage
      }
      this.templeteService.updateTemplate(data, this.templateUpdateId).then(function (res) {
        self.spinner.hide();
        if (res.status) {
          self.reset()
          self.getTempletes()
          self.toastr.success(res.message, 'Templete');
        }
      })
    } else {
      this.spinner.hide();
      this.toastr.error('PLease make sure to enter title and templete', 'Templete');
    }
  }

  deleteTemplete() {
    $('#exampleModal').modal('hide')
    this.spinner.show();
    var self = this;
    this.templeteService.deleteTemplateById(this.templateDeleteId).then(function (res) {
      self.spinner.hide();
      if (res.status) {
        self.reset()
        self.getTempletes()
        self.toastr.success(res.message, 'Templete');
      }
    })
  }


  searchTempletes(value) {
    this.templateData = this.searchData.filter(function (obj) {
      return Object.keys(obj)
        .some(function (k) {
          if (k == "title")
            return obj[k].toLowerCase().indexOf(value.toLowerCase()) !== -1;
        });
    });
  }

}
