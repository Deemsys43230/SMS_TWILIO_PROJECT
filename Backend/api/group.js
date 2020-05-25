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

var updateGroup = function(data, cb) {
    const log = require('../util/logger').log(component, ___filename);
    log.debug(component, 'Add User to Group', { attach: data.groupId });
    log.close();
    // var query = { 
    //     groupId:data.groupId,
    //     users:  {$elemMatch: { $in:data.contactIds }}
    // };
    // model.find(query, (err, groupList) => {
    //     if (err) {
    //         log.error(component, 'contact exsits find error', { attach: err });
    //         log.close();
    //         return cb(err);
    //     }
    //     log.debug(component, 'contact excist list found', {attach: groupList});
    //     log.close();
    //     if(groupList.length == 0) {
            model.findOneAndUpdate({groupId: data.groupId},{"$push": {"users":  data.contactIds } } )
            .then(users => {
                log.debug(component, `retrieved ${users} group of users`);
                log.close();  
                return cb(null, 'User Added to Group Successfully!');
            })
            .catch(err => {
                log.error(component, 'update users to group error', { attach: err });
                log.close();
                return cb(err);
            })
    //     } else {
    //         console.log(groupList)
    //         if(data.contactIds == 1) {
    //             log.debug(component, 'user already exsits in group');
    //             log.close();
    //             return cb(null, 'User Already Excist in this Group')
    //         } else {
    //             groupList.filter(singleData => {
    //                 singleData.users.includes('oli')
    //             })
    //         }
            
    //     }
    // })
    
};

var removeUserFromGroup = function(data, cb) {
    const log = require('../util/logger').log(component, ___filename);
    log.debug(component, 'updating contact', { attach: data.id });
    var query = {
        "userId": { $in:data.contactIds }
    };
    var updateQuery = {
        groupId: data.groupId
    }
    model.update({  groupId: data.groupId },{"$pull":{"users":{"userId":data.userId}}})
    .then(group => {
        log.debug(component, 'user romved from group', { attach: group.result });
        log.close();
        return cb(null, group);
    })
    .catch(err => {
        log.error(component, 'remove user from group error', { attach: err });
        log.close();
        return cb(err, null);
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
            { "$unwind": { "path": "$users", "preserveNullAndEmptyArrays": true }},
              {
                "$lookup": {
                  "from": "contacts",
                  "localField": "users.userId",
                  "foreignField": "userId",
                  "as": "users"
                }
              },
              {
                $unwind: {
                    path: "$users",
                    preserveNullAndEmptyArrays: true
                }
            },
              { "$group": {
                "_id": "$_id",
                "groupName": { "$first": "$groupName" },    
                "groupId": { "$first": "$groupId" },
                "users": { "$push": "$users" }
              }}
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
                { "$unwind": { "path": "$users", "preserveNullAndEmptyArrays": true }},
              {
                "$lookup": {
                  "from": "contacts",
                  "localField": "users.userId",
                  "foreignField": "userId",
                  "as": "users"
                }
              },
              {
                $unwind: {
                    path: "$users",
                    preserveNullAndEmptyArrays: true
                }
            },
              { "$group": {
                "_id": "$_id",
                "groupName": { "$first": "$groupName" },    
                "groupId": { "$first": "$groupId" },
                "users": { "$push": "$users" }
              }}
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

var search = function (searchData, cb) {
    // setup
    const log = require('../util/logger').log(component, ___filename);
    log.debug(component, 'searching restaurant', { attach: searchData });
    var query = [
        {
            $match: { groupName : new RegExp(searchData.name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi') }
        }, 
        { "$unwind": { "path": "$users", "preserveNullAndEmptyArrays": true }},
        {
            "$lookup": {
              "from": "contacts",
              "localField": "users.userId",
              "foreignField": "userId",
              "as": "users"
            }
          },
          {
            $unwind: {
                path: "$users",
                preserveNullAndEmptyArrays: true
            }
        },
          { "$group": {
            "_id": "$_id",
            "groupName": { "$first": "$groupName" },    
            "groupId": { "$first": "$groupId" },
            "users": { "$push": "$users" }
          }}
    ];
    log.debug(component, 'Query is', { attach: query});
    log.close();
    model.aggregate(query).collation({locale: "en", strength: 2})
    .then(users => {
        log.debug(component, `retrieved ${users.length} Search related Users`);
        log.close();
                return cb(null, users);
    })
    .catch(err => {
        log.error(component, 'find all search users error', { attach: err });
        log.close();
        return cb(err);
    })
    
}

module.exports = {
    find: find,
    create: create,
    update: update,
    remove: remove,
    updateGroup:updateGroup,
    removeUserFromGroup:removeUserFromGroup,
    search: search
};