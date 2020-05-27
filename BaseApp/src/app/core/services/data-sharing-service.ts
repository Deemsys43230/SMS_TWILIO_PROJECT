import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataSharingService {
    constructor() { }

    private subject = new BehaviorSubject({ recipientType: null, recipients: [] });
    sharedData = this.subject.asObservable();

    nextData(data: any) {
        console.log(data);
        this.subject.next(data);
    }

}