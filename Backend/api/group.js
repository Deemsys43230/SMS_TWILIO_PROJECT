/**
 * group API
 */
'use strict';
const component = "USER";
const model = require('../models/group');

var create = function (data, cb) {
    // setup
    const log = require('../util/logger').log(component, ___filename);

    log.debug(component, 'group data', { attachInline: data });
    // hash the password
    
    var groupModel = new model(data);
    groupModel.save()
        .then(group => {
            log.debug(component, 'new group created:', { attachInline: group });
            log.close();
            return cb(null, group);
        })
        .catch(err => {
            log.error(component, 'create group error', { attach: err });
            log.close();
            return cb(err);
        });
};



var update = function(data, cb) {
    const log = require('../util/logger').log(component, ___filename);
    log.debug(component, 'updating group', { attach: data.id });
    
    model.findOneAndUpdate({ groupId: data.id }, data,  (err, group) => {
        if (err) {
            log.error(component, 'update group error', { attach: err });
            log.close();
            return cb(err);
        }
        log.debug(component, 'group updated', {attach: group});
        log.close();
        return cb(null, group);
    });
};


var remove = function (groupId, cb) {
    // setup
    const log = require('../util/logger').log(component, ___filename);
    log.debug(component, 'removing group', { attach: groupId });
    log.close();
    model.remove({ groupId: groupId })
        .then(group => {
            log.debug(component, 'group removed', { attach: group.result });
            log.close();
            return cb(null, group);
        })
        .catch(err => {
            log.error(component, 'remove group error', { attach: err });
            log.close();
            return cb(err);
        });
};


var find = {
    /**
     * find all contacts
     * @param {Object} opts - search options
     * @param {number} opts.maxResults - max number of contacts to return
     * @async
     */
    all: function (opts, cb) {
        var ret;
        const log = require('../util/logger').log(component, ___filename);
        log.debug(component, 'searching for all contacts');
        var query = [
              {
                "$lookup": {
                  "from": "contacts",
                  "localField": "groupId",
                  "foreignField": "groupId",
                  "as": "users"
                }
              }
        ];
        model.aggregate(query)
            .then(contacts => {
                log.debug(component, `retrieved ${contacts.length} contacts`);
                log.close();
                return cb(null, contacts);
            })
            .catch(err => {
                log.error(component, 'find all contacts error', { attach: err });
                log.close();
                return cb(err);
            })
    },
    by: {
        /**
         * find contacts by id
         * @param {String} id - group id
         * @async
         */
        id: function (id, cb) {
            const log = require('../util/logger').log(component, ___filename);
            log.debug(component, 'searching for group id', { attach: id });
            var query = [
                {$match:{groupId:id}},
                {
                    "$lookup": {
                      "from": "contacts",
                      "localField": "groupId",
                      "foreignField": "groupId",
                      "as": "users"
                    }
                  }
            ]
            log.debug(component, 'search group', { attach: query });
            model.aggregate(query)
                .then(group => {
                    if (!group) log.debug(component, `no group found ${id}`);
                    else {  
                        log.debug(component, `${group.length} group found`);
                        log.trace(component, 'group found');
                        log.close();
                    }
                    return cb(null, group);
                })
                .catch(err => {
                    log.error(component, 'find all group error', { attach: err });
                    log.close();
                    return cb(err);
                })
        },
        status: function (status, cb) {
            const log = require('../util/logger').log(component, ___filename);
            var query = { 'active': status };
            if(status==-1)
                query = {};
            model.find(query)
            .then(group => {
                log.debug(component, `retrieved ${group.length} contacts`);
                log.close();
                return cb(null, group);
            })
            .catch(err => {
                log.error(component, 'find all contacts error', { attach: err });
                log.close();
                return cb(err);
            })
        },
    }
};


module.exports = {
    find: find,
    create: create,
    update: update,
    remove: remove,
};