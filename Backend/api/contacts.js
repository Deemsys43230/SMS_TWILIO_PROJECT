/**
 * contact API
 */
'use strict';
const component = "USER";
const model = require('../models/contacts');
const twilioModel = require('../models/twilioConfig');
const _ = require("underscore");
const multer = require("multer");
var importCSV = require('../templates/importContacts');
const config = require('config');
const uuid=require('../util/misc');
const async=require('async');

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
        findDupliactePhoneNumber: function (data, cb) {
            const log = require('../util/logger').log(component, ___filename);
            log.debug(component, 'searching for Phone Number', { attach: data.phoneNumber });
            if(data.id!=undefined&&data.id!="") {
                query = { phoneNumber: data.phoneNumber, userId: { $ne: data.id} };
            } else {
                query = { phoneNumber: data.phoneNumber };
            }
            // var query = { phoneNumber: data.phoneNumber };
            log.debug(component, 'search contact', { attach: query });
            model.find(query)
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
    
        var query = [
            {
                $match: { 
                    $or: [
                        { name : new RegExp(searchData.searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi') },
                        { phoneNumber:new RegExp(searchData.searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi') }
                    ]
                }
            }
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
            notifyUsers.push(JSON.stringify({
                identity:contact.userId,
                binding_type: 'sms',
                address: twilioPrefix+contact.phoneNumber
            }))
        });
    
        const notificationOpts = { 
            toBinding: notifyUsers, 
            body: smsSendData.messageBody, 
        }; 
        new Promise(resolve => {
            client.notify.services(notifyServiceId)
            .notifications.create(notificationOpts).then(notification => {
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
};

//Importing Contact
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, config.batchFileSaveLocationPrefix)
    },
    filename: function (req, file, cb) {     
      cb(null, "ImportingFile-"+Date.now()+".csv");
    }
});

var upload = multer({ 
    storage: storage,
    fileFilter: function fileFilter(req, file, cb) {
      if(['csv'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1){
        cb({"message": "Invalid File Format - Supported Format: .csv"}, false);
      } else{
        cb(null, true);       
      }     
    }
}).single('file');

var request = require('request');

var importUploads = function(req, res, cb){  
    const log = require('../util/logger').log(component, ___filename);
    upload(req, res, function(err){
        if(err){
            return cb(err, null);
        }else {
            if (!req.file) {
                return cb("Please send file", null);
            } else {
                async.waterfall([
                    function(cb) {
                        importCSV.processCSVFile(req.file.path, function(err, data){
                            if(err) {
                                log.error(component, 'Process CSV file Error');
                                log.close();
                                return cb(err)
                            } else {
                                console.log(data);
                                var sanitaizedContats = [];
                                var promises = [];
                                promises.push(new Promise(function(resolve, reject) {
                                    data.contacts.forEach(async function(contact, index1){
                                        await find.by.findDupliactePhoneNumber(contact , (err, result) => {
                                            if(err) {
                                                // cb(err, null)
                                                reject(err)
                                            } else {
                                                if(result.length == 0) {
                                                    sanitaizedContats.push(contact)
                                                } else {
                                                    log.debug(component, "Found Duplicate Phone Number", {attachInline: contact.phoneNumber});
                                                    log.close();
                                                }
                                                // cb(null, sanitaizedContats);
                                                resolve();
                                            }
                                        })
                                    })                                   
                                }))
                                Promise.all(promises).then(function() {
                                    cb(null, sanitaizedContats);
                                })
                            }
                        })
                    }, async function(sanitaizedContats, cb) {
                        console.log(sanitaizedContats)
                        await new Promise(resolve => {
                            sanitaizedContats.forEach(async function(contact, index1){
                                await new Promise(resolve => {
                                    contact.userId = uuid.uid();
                                    cb(null, sa)
                                    resolve()
                                })
                            })
                        })
                    }
                ],(err) => {
                    if (err) {
                        log.error(component, 'Import Contcats Error', { attach: err });
                        log.close();
                        return cb(err);
                    }
                    // model.insertMany(sanitaizedContats)
                    // .then(result => {
                    //     log.debug(component, 'Bulk Data inserted in Contcats');
                    //     log.close();
                        return cb(null, sanitaizedContats)
                    // })
                    // .catch(err => {
                    //     log.error(component,'Error while insert Bulk Data');
                    //     log.close();
                    //     return cb(err, null);
                    // })
                })
            }
        }
    })
};

module.exports = {
    find: find,
    create: create,
    update: update,
    remove: remove,
    search: search,
    sendSMS: sendSMS,
    importUploads : importUploads
};
