/**
 * user API
 */
'use strict';
const component = "USER API";
const model = require('../models/User');
const security=require('../util/security');
const ERR=require('../errors.json');
const async=require('async');
const mongoose = require('mongoose');
const config = require('config');
const html = require('../util/html');

var find = {
    /**
     * find all users
     * @param {Object} opts - search options
     * @param {number} opts.maxResults - max number of users to return
     * @async
     */
    all: function (opts, cb) {
        var ret;
        const log = require('../util/logger').log(component, ___filename);
        log.debug(component, 'searching for all users');
        var query = {};
        model.find(query)
        .then(users => {
            log.debug(component, `retrieved ${users.length} users`);
            log.close();
            return cb(null, users);
        })
        .catch(err => {
            log.error(component, 'find all users error', { attach: err });
            log.close();
            return cb(err);
        })
    },
    by: {
        credentials: function(data, cb) {
            const log = require('../util/logger').log(component, ___filename);
            log.debug(component, 'searching for all users');
            var query = { userName: data.username, password: data.password};
            model.find(query)
            .then(users => {
                log.debug(component, `retrieved ${users.length} users`);
                log.close();
                return cb(null, users);
            })
            .catch(err => {
                log.error(component, 'find all users error', { attach: err });
                log.close();
                return cb(err);
            })
        },
        validateSuperPassword: function(data, cb) {
            const log = require('../util/logger').log(component, ___filename);
            log.debug(component, 'searching for all users');
            var query = { userId: data.userId, superPassword: data.superPassword};
            model.find(query)
            .then(users => {
                log.debug(component, `retrieved ${users.length} users`);
                log.close();
                return cb(null, users);
            })
            .catch(err => {
                log.error(component, 'find all users error', { attach: err });
                log.close();
                return cb(err);
            })
        }
    }
};
//Change password
var changePassword = function (data, cb) {
    const subject = "Change Password";
    const log = require('../util/logger').log(component, ___filename);
    log.debug(component, 'User Changing Password', { attach: data });
    async.waterfall([
        function(cb) {
            //Hash Current Password
            if (data.currentPassword) data.currentPassword = require('../util/security').hash(data.currentPassword);
            //Hash New Password
            if (data.newPassword) data.newPassword = require('../util/security').hash(data.newPassword);
            var query = {
                "userId":data.userId, "password": data.currentPassword
            }
            model.findOne(query, (err, user) => {
                if (err) {
                    log.error(component, 'change password error', { attach: err });
                    log.close();
                    return cb(err);
                } 
                if (!user) {
                    log.info(component, 'Invalid Password');
                    log.close();
                    return cb(ERR.INVALID_CREDENTIALS);
                }    
                else {
                    log.debug(component, 'user found:', { attach: data.newPassword });
                    log.close();
                    var query = {
                        'password':data.newPassword
                    }
                    model.findOneAndUpdate({"userId":data.userId}, query, function(err, userUpdated) {
                        if(err)
                            return cb(err. null)
                        else{
                            return cb(null, userUpdated)
                        }
                    });
                }
            });
        },
        function (userUpdated, cb) {
            html.create({
                data: {
                    userName: `${userUpdated.name}`
                },
                templateName: "changepassword_success"
            }, (err, contents) => {
                log.debug(component, 'Email content', {attach: contents});
                if(err==null)
                    require('../util/email').send(userUpdated.email, subject, contents, undefined, () => {
                    return cb(null,contents);
                    });
                else{
                    return cb(err);
                }
            });
            // return cb(null, userUpdated)
        }
    ], (err) => {
        if (err) {
            log.error(component, 'change password error', { attach: err });
            log.close();
            return cb(err);
        }
        log.close();
        return cb(null,data);
    });
}


module.exports = {
    find: find,
    changePassword: changePassword
}
