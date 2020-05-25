/**
 * contact API
 */
'use strict';
const component = "USER";
const model = require('../models/contacts');
const twilioModel = require('../models/twilioConfig');
const _ = require("underscore");

var accountSid;
var authToken;
var twilioPrefix;
var twilioFromNumber;
var messageingServiceId;
var notifyServiceId;

const log = require('../util/logger').log(component, ___filename);
const opts = {};
var query = {};
log.debug(component, 'Get All Twilio Config', { attach: query });
log.close();

twilioModel.find(query)
.then(twilio => {
    if (!twilio) log.debug(component, `no twilio found ${id}`);
    else {  
        log.debug(component, `${twilio} twilio found`);
        log.close();
        accountSid = twilio[0].accountSid;
        authToken = twilio[0].authToken;
        messageingServiceId = twilio[0].messageingServiceId;
        twilioFromNumber = twilio[0].fromPhone;
        twilioPrefix = twilio[0].cellPhonePrefix;
        notifyServiceId = twilio[0].notifyServiceId;
    }
})
.catch(err => {
    log.error(component, 'find all twilio error', { attach: err });
    log.close();
    return err;
})

var create = function (data, cb) {
    // setup
    const log = require('../util/logger').log(component, ___filename);

    log.debug(component, 'contact data', { attachInline: data });
    // hash the password
    
    var contactModel = new model(data);
    contactModel.save()
        .then(contact => {
            log.debug(component, 'new contact created:', { attachInline: contact });
            log.close();
            return cb(null, contact);
        })
        .catch(err => {
            log.error(component, 'create contact error', { attach: err });
            log.close();
            return cb(err);
        });
};



var update = function(data, cb) {
    const log = require('../util/logger').log(component, ___filename);
    log.debug(component, 'updating contact', { attach: data.id });
    
    model.findOneAndUpdate({ userId: data.id }, data,  (err, contact) => {
        if (err) {
            log.error(component, 'update contact error', { attach: err });
            log.close();
            return cb(err);
        }
        log.debug(component, 'contact updated', {attach: contact});
        log.close();
        return cb(null, contact);
    });
};


var remove = function (contactId, cb) {
    // setup
    const log = require('../util/logger').log(component, ___filename);
    log.debug(component, 'removing contact', { attach: contactId });
    model.remove({ userId: contactId })
        .then(contact => {
            log.debug(component, 'contact removed', { attach: contact.result });
            log.close();
            return cb(null, contact);
        })
        .catch(err => {
            log.error(component, 'remove contact error', { attach: err });
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
        var query = {};
        model.find(query)
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
         * @param {String} id - contact id
         * @async
         */
        id: function (id, cb) {
            const log = require('../util/logger').log(component, ___filename);
            log.debug(component, 'searching for contact id', { attach: id });
            var query = { userId: id };
            log.debug(component, 'search contact', { attach: query });
            model.findOne(query)
                .then(contact => {
                    if (!contact) log.debug(component, `no contact found ${id}`);
                    else {  
                        log.debug(component, `${contact.length} contact found`);
                        log.trace(component, 'contact found');
                        log.close();
                    }
                    return cb(null, contact);
                })
                .catch(err => {
                    log.error(component, 'find all contact error', { attach: err });
                    log.close();
                    return cb(err);
                })
        },
        status: function (status, cb) {
            const log = require('../util/logger').log(component, ___filename);
            var query = { 'active': status };
            if(status==-1)
                query = {};
            model.find(query).select(CONSTANTS.TEMPLATEFIELDLIST)
            .then(contact => {
                log.debug(component, `retrieved ${contact.length} contacts`);
                log.close();
                return cb(null, contact);
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
    if(searchData.name!=undefined&&searchData.name !="") {
        var query = [
            {
                $match: { 
                    $and: [
                        { name : new RegExp(searchData.name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi') }
                    ]
                }
            }
        ];
    } else if(searchData.name!=undefined&&searchData.name !=""&&searchData.phoneNumber!=undefined&&searchData.phoneNumber!="")  {
        var query = [
            {
                $match: { 
                    $and: [
                        { name : new RegExp(searchData.name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi') },
                        { phoneNumber:new RegExp(searchData.phoneNumber.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi') }
                    ]
                }
            }
        ];
    } else if(searchData.phoneNumber!=undefined&&searchData.phoneNumber!="")  {
        var query = [
            {
                $match: { 
                    $and: [
                        { phoneNumber:new RegExp(searchData.phoneNumber.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi') }
                    ]
                }
            }
        ];
    }
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
async function sendSMS(smsSendData, cb) {
    // setup
    const log = require('../util/logger').log(component, ___filename);
    log.debug(component, 'searching restaurant', { attach: smsSendData });
    log.close();
    console.log(accountSid);
    console.log(authToken)
    const client = require('twilio')(accountSid, authToken);

    var query = [
        {
            $match: { 
                     userId : { $in : smsSendData.smsSendIds}
            }
        }
    ];
    
    log.debug(component, 'Query is', { attach: query});
    log.close();
    model.aggregate(query).collation({locale: "en", strength: 2})
    .then(users => {
        log.debug(component, `retrieved ${users.length} Search related Users`);
        log.close();
        var notifyUsers = [];
        _.map(users, function(contact, index) {
            var bindingOpts = {
                identity:contact.userId,
                binding_type: 'sms',
                address: twilioPrefix+contact.phoneNumber
            }
            notifyUsers.push(bindingOpts)
        });
        console.log(notifyUsers)
        var santizedBindingOpts = JSON.stringify(notifyUsers);
        // console.log(santizedBindingOpts);
        // // const newData = [].concat.apply([],notifyUsers);
        console.log(santizedBindingOpts.substring(1, santizedBindingOpts.length-1));
        var santizedBindingDataOts = santizedBindingOpts.substring(1, santizedBindingOpts.length-1);
        var newSantizedData = santizedBindingDataOts.replace(/[{}]/g, "");
        // var newSantizedDataObj = {};
        // var newSantizedDataObj = newSantizedData;
        console.log(newSantizedData)
        new Promise(resolve => {
            client.notify.services(notifyServiceId)
            .notifications.create({
                toBinding: JSON.stringify({newSantizedData}),
                body: smsSendData.message
            }).then(notification => {
                console.log(notification.sid);
                cb(null, users);
                resolve()
            })
            .catch(err => {
                log.error(component, 'Error Found in SMS Notification');
                log.close()
                return cb(err, null)
            })
        })
        
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
    search: search,
    sendSMS: sendSMS
};
