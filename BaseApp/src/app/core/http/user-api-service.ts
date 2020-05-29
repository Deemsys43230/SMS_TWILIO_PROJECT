import { Injectable } from "@angular/core";
import { HttpClient } from "../../../../node_modules/@angular/common/http";
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map'
import { UserModel } from "../models/user-model";


@Injectable({
    providedIn:'root'
})

export class UserApiService{
    constructor(private httpClient:HttpClient){
    }

    public login(loginData:any):Promise<any>{
        return this.httpClient.post('/user/login',loginData).toPromise()
        .then(function(res){
            return res;
        },function(err){
            return err;
        })
    }

    public getProfile():Promise<any>{
        return this.httpClient.get("/users/user/getProfile").toPromise()
        .then(function(res){
            return res;
        },function(err){
            return err;
        })
    }

    public changePassword(data:any):Promise<any>{
        return this.httpClient.post("/user/changePassword",data).toPromise()
        .then(function(res){
            return res;
        },function(err){
            return err;
        })
    }

    public changeSettings(data:any):Promise<any>{
        return this.httpClient.post("/common/updateTwilioConfig",data).toPromise()
        .then(function(res){
            return res;
        },function(err){
            return err;
        })
    }

    public getTwilioSetting():Promise<any>{
        return this.httpClient.get("/common/getTwilioConfig").toPromise()
        .then(function(res){
            console.log(res)
            return res;
        },function(err){
            return err;
        })
    }

    public validateUserForSettings(data:any):Promise<any>{
        return this.httpClient.post("/user/validateUserForStttings",data).toPromise()
        .then(function(res){
            return res;
        },function(err){
            return err;
        })
    }
}