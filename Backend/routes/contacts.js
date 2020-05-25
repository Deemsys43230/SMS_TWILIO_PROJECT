/**
 * contact routes
 */
'use strict'
const component = "CONTACT";
const config = require('config');
const router = require('express').Router();
const ERR = require('../errors.json');
const contactApi = require('../api/contacts');
const groupApi = require('../api/group');
const security=require('../util/security');
const uuid=require('../util/misc');

router
    .get('/', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
        // setup
        const log = require('../util/logger').log(component, ___filename);
        log.debug(component, 'searching for all contacts');

        var opts = {
            maxResults: Number(req.query.num_results)
        };
        contactApi.find.all(opts, function (err, contacts) {
            if (err) {
                log.error(component, 'find all contacts error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } else {
                log.debug(component, `found ${contacts.length} contacts`);
                log.close();
                return res.json({
                    status:true,
                    data: contacts
                });
            }
        });
    })
    .post('/', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
   
        // setup
        const log = require('../util/logger').log(component, ___filename);
        log.debug(component, 'creating new contact');
        // extract
        var contactData = req.body;
        contactData.userId=uuid.uid();

        contactApi.create(contactData, (err, contact) => {
            if (err) {
                log.error(component, 'create new contact error', { attach: err });
                log.close();
                res.json({status:false, err: ERR.MANDATORY_FIELD_MISSING });
            } else {
                // extract into the sanitize method
                var ret = {
                    userId: contact.userId,
                }
                log.debug(component, 'new contact created');
                log.trace(component, 'contact:', { attach: contact });
                log.close();
                return res.json({
                    status:true,
                    data: ret
                });
            }
        });
    })
    .get('/:contactId', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
        const log = require('../util/logger').log(component, ___filename);
        contactApi.find.by.id(req.params.contactId, function (err, contact) {
            if (err) {
                log.error(component, 'find contact by id error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } else {
                if(!contact) {
                    log.debug(component, 'no contact found', { attachInline: ERR.NO_SUCH_ID });
                    log.close();
                    res.json({status:false, err: ERR.NO_SUCH_ID });
                }
                else{
                    log.debug(component, 'contact found:', { attach: contact });
                    log.close();
                    return res.json({
                        status:true,
                        data: contact
                    });
                }
            }
        });
    })
    .put('/:contactId', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
        const log = require('../util/logger').log(component, ___filename);
        // extract
        var contactData = req.body;
        contactData.id = req.params.contactId;
        log.debug(component, 'updating contact', { attach: contactData.id });
        log.trace(component, 'contact data:', { attach: contactData });

        contactApi.find.by.id(req.params.contactId, function (err, contact) {
            if (err) {
                log.error(component, 'find contact by id error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } 
            else {
                if(!contact) {
                    log.debug(component, 'no contact found', { attachInline: ERR.NO_SUCH_ID });
                    log.close();
                    res.json({status:false, err: ERR.NO_SUCH_ID });
                }
                else{
                    contactApi.update(contactData, function (err, contact) {
                        if (err) {
                            log.error(component, 'update contact error', { attach: err });
                            log.close();
                            return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
                        } else {
                            log.debug(component, 'contact updated');
                            log.trace(component, 'contact:', { attach: contact });
                            log.close();
                            return res.json({
                                status:true,
                                message: "Contact Updated Successfully!"
                            });
                        }
                    });
                }
            }
        });

    })
    .post('/:contactId', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
        const log = require('../util/logger').log(component, ___filename);
        // extract
        var contactId = req.params.contactId;
        // @todo validate
        log.debug(component, 'deleting contact', { attach: contactId });
        // delete
        contactApi.find.by.id(req.params.contactId, function (err, contact) {
            if (err) {
                log.error(component, 'find contact by id error', { attach: err });
                log.close();
                return res.json({ err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } else {
                if(!contact) {
                    log.debug(component, 'no contact found', { attachInline: ERR.NO_SUCH_ID });
                    log.close();
                    res.json({status:false, err: ERR.NO_SUCH_ID });
                }
                else{
                    contactApi.remove(contactId, function (err, contactId) {
                        if (err) {
                            log.error(component, 'delete contact error', { attach: err });
                            log.close();
                            return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
                        } else {
                            log.debug(component, 'contact deleted');
                            log.close();
                            return res.json({ status:true,
                            message:"Contact Deleted Successfully!" });
                        }
                    });
                }
            }
        });
    })
    .post('/search/users', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
        // setup
        const log = require('../util/logger').log(component, ___filename);
        log.debug(component, 'searching for all users', {attach:req.body});
        log.close();
        
        var searchData=req.body;
        contactApi.search(searchData, function (err, restaurants) {
            if (err) {
                log.error(component, 'find all restaurants error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } else {
                log.debug(component, `found ${restaurants.length} restaurants`);
                log.close();
                return res.json({
                    status:true,
                    data: restaurants
                });
            }
        });
    })
    .post('/sms/users', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
        // setup
        const log = require('../util/logger').log(component, ___filename);
        log.debug(component, 'Send SMS t invidual Users', {attach:req.body});
        log.close();
        
        var sendSMSData=req.body;
        contactApi.sendSMS(sendSMSData, function (err, restaurants) {
            if (err) {
                log.error(component, 'Send SMS to Individual users error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } else {
                log.debug(component, `SMS to individuals users sent successfully!`);
                log.close();
                return res.json({
                    status:true,
                    message: "Message Sent Successfully!"
                });
            }
        });
    })
    .post('/sms/group', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
        // setup
        const log = require('../util/logger').log(component, ___filename);
        log.debug(component, 'Send SMS t invidual Users', {attach:req.body});
        log.close();
        
        var sendSMSData=req.body;
        groupApi.find.by.groupId(sendSMSData, function(err, result) {
            if (err) {
                log.error(component, 'Fing group users error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } else {
                log.debug(component, `Found Group users!`);
                log.close();
                sendSMSData.smsSendIds = result;
                contactApi.sendSMS(sendSMSData, function (err, restaurants) {
                    if (err) {
                        log.error(component, 'Send SMS to Individual users error', { attach: err });
                        log.close();
                        return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
                    } else {
                        log.debug(component, `SMS to individuals users sent successfully!`);
                        log.close();
                        return res.json({
                            status:true,
                            message: "Message Sent Successfully!"
                        });
                    }
                });
            }
        })
        
    });

module.exports = router;
