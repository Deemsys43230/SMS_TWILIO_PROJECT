import { Injectable } from "@angular/core";
import { BillApiService } from "../http/bill-api-service";


@Injectable({
    providedIn:'root'
})

export class BillService{
    constructor(private billApiService:BillApiService){}

    public getProcedures()
    {
       return this.billApiService.getProcedures().then(function(res){
            return res;
        },function(err){
            return err;
        })
    }

    public saveBill(billData:any)
    {
        return this.billApiService.saveBill(billData).then(function(res){
            return res;
        },function(err){
            return err;
        })  
    }

    public updateBill(billData:any)
    {
        return this.billApiService.updateBill(billData).then(function(res){
            return res;
        },function(err){
            return err;
        })  
    }

    public getBillsByStatus(searchQuery:any)
    {
        return this.billApiService.getBillsByStatus(searchQuery).then(function(res){
            return res;
        },function(err){
            return err;
        })  
    }

    public getBillByInvoiceId(invoiceId:any)
    {
        return this.billApiService.getBillByInvoiceId(invoiceId).then(function(res){
            return res;
        },function(err){
            return err;
        })  
    }

    public viewBill(invoiceId:any)
    {
        return this.billApiService.viewBill(invoiceId).then(function(res){
            return new Blob([res], { type: 'application/pdf' });
                },function(err){
            return err;
        })   
    }
    
    public changeBillStatus(invoiceId:any,status:any)
    {
        return this.billApiService.changeBillStatus(invoiceId,status).then(function(res){
            return res;
                },function(err){
            return err;
        })
    }
}