/**
 * site info routes - contact us
 */
'use strict'
const router = require('express').Router();
const siteInfoApi = require('../api/siteInfoApi');
const component = "ROUTER";
const ERR = require('../errors.json');
const security=require('../util/security');
const userapi = require('../api/user');
const uuid=require('../util/misc');

router

    .post('/updateTwilioConfig', security.verifySecurity(["SMS_GENERATOR"]), function(req,res) {
        const log = require('../util/logger').log(component, ___filename);

        log.debug(component, 'Submitting Twilio COnfig');
        log.close();
        var data = req.body;

        if(data.id!=undefined&&data.id!="") {
            siteInfoApi.updateTwilioConfig(data, function(err, twilio) {
                if(err) {
                    return res.json({status:false, err: err});
                } else {
                    log.debug(component, `Created Twilio Config`, {attach:twilio});
                    log.close();
                    return res.json({
                        status: true,
                        message:'Twilio Config Updated Successfully!'
                    });
                }
            })
        } else {
            return res.json({status:false, err: ERR.MANDATORY_FIELD_MISSING});
        }
        
    })
    .get("/getTwilioConfig", security.verifySecurity(["SMS_GENERATOR"]), function(req, res) {
        const log = require('../util/logger').log(component, ___filename);

        log.debug(component, 'Get 1st index Twilio COnfig');
        log.close();

        var opts = {
            maxResults: Number(req.query.num_results)
        };

        siteInfoApi.find.by.id(opts, function(err, twilio) {
            if(err) {
                return res.json({status:false, err: err});
            } else {
                log.debug(component, `Found 1st index Twilio Config`, {attach:twilio});
                log.close();
                return res.json({
                    status: true,
                    data : twilio
                });
            }
        })
    })

module.exports = router;