
/**
 * Validation utils
 */
'use strict'
const component ="VALIDATOR";
const async = require('async');
const ERR = require('../errors');
const userApi = require('../api/user');
const security = require('../util/security');

var validate = {
    user: {
        for: {
            login: function (user, cb) {
                const log = require('../util/logger').log(component, ___filename);
                return new Promise((resolve, reject) => {
                    if (security.hash(user.actualPassword) === user.password) {
                        log.debug(component, 'user valid for login');
                        log.close();
                        return resolve(user);
                    } else {
                        log.error(component, `${ERR.INVALID_CREDENTIALS.message}`);
                        log.close();
                        return reject(ERR.INVALID_CREDENTIALS);
                    }
                });
            },
            create: function (userData, cb) {
                const log = require('../util/logger').log(component, ___filename);
                return new Promise((resolve, reject) => {
                    var err = "";
                    log.debug(component, 'validating unique fields');
                    userApi.find.by.email(userData.email, function (err, user) {
                        if (err) {
                            log.error(component, `validate user email error ${err}`);
                            log.close();
                            return reject(err);
                        } else {
                            if (user) {
                                log.warn(component, 'user email is not unique');
                                log.close();
                                return reject(ERR.EMAIL_ALREADY_REGISTERED);
                            } else {
                                log.debug(component, 'user email is unique');
                                log.close();
                                log.debug(component, 'user data is valid');
                                return resolve(userData);
                            }
                        }
                    });
                });
            },
            password: function(userData, cb) {

            },
            userName: function (userData, cb) {
                const log = require('../util/logger').log(component, ___filename);
                return new Promise((resolve, reject) => {
                    log.debug(component, 'validating unique fields');
                    userApi.find.by.userName(userData, function (err, user) {
                        if (err) {
                            log.error(component, `validate user name error ${err}`);
                            log.close();
                            return reject(err);
                        } else {
                            if (user) {
                                log.warn(component, 'user name is not unique');
                                log.close();
                                return reject(ERR.USERNAME_ALREADY_REGISTERED);
                            } else {
                                log.debug(component, 'user name is unique');
                                log.close();
                                log.debug(component, 'user data is valid');
                                return resolve(userData);
                            }
                        }
                    });
                });
            },
        }
    }
    
}

module.exports = {
    validate: validate
}
