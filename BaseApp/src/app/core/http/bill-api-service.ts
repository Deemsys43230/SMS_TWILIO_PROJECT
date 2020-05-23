import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn:'root'
})
export class BillApiService{

    constructor(private httpClient:HttpClient){}

    public getProcedures():Promise<any>{
        return this.httpClient.get('procedures/').toPromise()
        .then(function(res){
            return res;
        },function(err){
            return err;
        })
    }

    public saveBill(billData:any):Promise<any>{
        return this.httpClient.post('superbill/',billData).toPromise()
        .then(function(res){
            return res;
        },function(err){
            return err;
        }) 
    }

    public updateBill(billData:any):Promise<any>{
        return this.httpClient.put('superbill/'+billData.invoiceId,billData).toPromise()
        .then(function(res){
            return res;
        },function(err){
            return err;
        }) 
    }

    public getBillsByStatus(searchQuery):Promise<any>{
        return this.httpClient.post('superbill/getByStatus/',{"searchQuery":searchQuery}).toPromise()
        .then(function(res){
            return res;
        },function(err){
            return err;
        }) 
    }

    public getBillByInvoiceId(invoiceId:any):Promise<any>{
        return this.httpClient.get('superbill/'+invoiceId).toPromise()
        .then(function(res){
            return res;
        },function(err){
            return err;
        }) 
    }

    public viewBill(invoiceId:any):Promise<any>{
        return this.httpClient.get('superbill/print/'+invoiceId,{ responseType:'blob' }).toPromise()
        .then(function(res){
            return res;
        },function(err){
            return err;
        }) 
    }

    public changeBillStatus(invoiceId:any,status:any):Promise<any>{
        return this.httpClient.post('superbill/changeStatus',{ invoiceId:invoiceId,status:status }).toPromise()
        .then(function(res){
            return res;
        },function(err){
            return err;
        }) 
    }
    
}