/**
 * user routes
 */
'use strict'
const component = "ROUTER";
const config = require('config');
const router = require('express').Router();
const ERR = require('../errors.json');
const token=require("../util/token");
const util=require("../util/misc");
const userApi = require('../api/user');
const security= require('../util/security');

router
.post('/login', (req, res) => {
    // setup
    const log = require('../util/logger').log(component, ___filename);
    log.debug(component, 'User Logging');
    log.close();

    req.body.role="SMS_GENERATOR";
    var data=req.body;
    if (data.password) data.password = require('../util/security').hash(data.password);
    userApi.find.by.credentials(data,function(err, user){
        if(err){
            return res.json({
                "status": false,
                "message": "Failed to login!",
                "err": err
            })
        }else{
            if(user.length != 0) {
                return res.json({
                    "status": true,
                    "message": "User Successfully Authentiacted!",
                    "token": token.create({"exp": config.sessionTimeOut,"data": user}),
                    "user": user
                })
            } else {
                return res.json({
                    "status": false,
                    "message": "Invalid Credentials!"
                })
            }
            
        }           
    })
                   
})

//Change password
.post('/changePassword', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
    const log = require('../util/logger').log(component, ___filename);
    log.debug(component, 'User change password');
   
    req.body.userId = req.user.userId;
    if(req.body.newPassword==req.body.confirmNewPassword) {
        userApi.changePassword(req.body, function (err) {
            if (err) {
                log.error(component, 'Change Password Error', { attach: err });
                log.close();
                return res.json({
                    request_status: true,
                    status: false,
                    err: Object.assign(ERR.NO_SUCH_EMAIL, { message: ERR.INVALID_CREDENTIALS.message })
                });
            } else {
                log.debug(component, 'Change Password Successfull');
                log.close();
                return res.json({
                    request_status: true,
                    status: true,
                    message: "Password Changed Successfully"
                });
            }
        });
    } else {
        return res.json({
            request_status: true,
            status: false,
            message: "New Password not matched"
        });
    }
})

module.exports = router;