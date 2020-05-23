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
            var query = { email: data.email, password: data.password};
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
}

module.exports = {
    find: find
}
