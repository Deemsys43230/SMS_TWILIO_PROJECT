

export class UserModel {

    public userId:String;
    public username:String;
    public role:String;
    public status:String;
    public addedDate:String;

    constructor(User) {
        this.userId= User.userId;
        this.username=User.username;
        this.role=User.role;
        this.status=User.status;
        this.addedDate=User.addedDate;
    }
}