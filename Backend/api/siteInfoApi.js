
/**
 * Site Info API
 */
'use strict';
const component = "Site Info Api";
const config = require('config');
const twilioSettingModel = require('../models/twilioConfig');

var find = {
    by: {
        /**
         * find contacts by id
         * @param {String} id - contact id
         * @async
         */
        id: function(opts, cb) {
            const log = require('../util/logger').log(component, ___filename);
            var query = {};
            log.debug(component, 'Get All Twilio Config', { attach: query });
            log.close();

            twilioSettingModel.find(query)
            .then(twilio => {
                if (!twilio) log.debug(component, `no twilio found ${id}`);
                else {  
                    log.debug(component, `${twilio} twilio found`);
                    log.debug(component, `${twilio.length} twilio found`);
                }
                return cb(null, twilio[0]);
            })
            .catch(err => {
                log.error(component, 'find all twilio error', { attach: err });
                log.close();
                return cb(err);
            })
        }
    }
};

var updateTwilioConfig = function(data,cb) {

    const log = require('../util/logger').log(component, ___filename);
    log.debug(component, 'creating Twilio Config', {attach:data});
    log.close();

    twilioSettingModel.findOneAndUpdate({id: data.id}, data)
    .then(twilioSetting => {
        log.debug(component, 'Successfully Updated Twilio Config');
        log.close();
        return cb(null, twilioSetting);
    })
    .catch(err => {
        log.error(component, 'update twilio config error', { attach: err });
        log.close();
        return cb(err);
    });
};

module.exports = {
    find: find,
    updateTwilioConfig : updateTwilioConfig
};