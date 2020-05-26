import { Injectable } from '@angular/core';
import { TemplateApiService } from '../http/template-api-service';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private templateAPIService: TemplateApiService) { }

  public getAllTemplates() : any {
    return this.templateAPIService.getAllTemplates().then(function (res) {
      return res;
    }, function (err) {
      return err;
    })
  }
  public addTemplate(templateData: any) {
    return this.templateAPIService.addTemplate(templateData).then(function (res) {
      return res;
    }, function (err) {
      return err;
    })
  }
  public updateTemplate(templateData: any, templateId: any) {
    return this.templateAPIService.updateTemplate(templateData, templateId).then(function (res) {
      return res;
    }, function (err) {
      return err;
    })
  }
  public getTemplateById(templateId: any) : any {
    return this.templateAPIService.getTemplateById(templateId).then(function (res) {
      return res;
    }, function (err) {
      return err;
    })
  }
  public deleteTemplateById(templateId: any) {
    return this.templateAPIService.deleteTemplateById(templateId).then(function (res) {
      return res;
    }, function (err) {
      return err;
    })
  }
}
