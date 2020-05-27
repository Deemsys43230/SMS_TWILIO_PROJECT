import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataSharingService {
    constructor() { }

    private subject = new BehaviorSubject({
        recipientType: null, recipients: [], template: {
            "_id": "",
            "title": "",
            "template": "",
            "templateId": ""
        }
    });
    sharedData = this.subject.asObservable();

    nextData(data: any) {
        this.subject.next(data);
    }

}