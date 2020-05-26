import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TemplateApiService {

  constructor(private httpClient: HttpClient) { }

  public getAllTemplates(): Promise<any> {
    return this.httpClient.get('/user/templates').toPromise()
      .then(function (res) {
        return res;
      }, function (err) {
        return err;
      })
  }

  public addTemplate(data: any): Promise<any> {
    return this.httpClient.post('/user/templates', data).toPromise()
      .then(function (res) {
        return res;
      }, function (err) {
        return err;
      })
  }

  public updateTemplate(data: any, id: any): Promise<any> {
    return this.httpClient.put('/user/templates/' + id, data).toPromise()
      .then(function (res) {
        return res;
      }, function (err) {
        return err;
      })
  }

  public getTemplateById(id: any): Promise<any> {
    return this.httpClient.get('/user/templates/' + id).toPromise()
      .then(function (res) {
        return res;
      }, function (err) {
        return err;
      })
  }

  public deleteTemplateById(id: any): Promise<any> {
    return this.httpClient.delete('/user/templates/' + id, {}).toPromise()
      .then(function (res) {
        return res;
      }, function (err) {
        return err;
      })
  }

}
