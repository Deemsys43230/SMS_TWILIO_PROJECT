/**
 * Token utils
 */
'use strict'
const component = "JWT";
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v1');
const config = require('config');
const ms = require('ms');
const CONSTANTS = require('./constants.json');

function createToken(opts=CONSTANTS.DEFAULT.TOKEN.DATA) {
    const log = require('../util/logger').log(component, ___filename);
    var ret;
    var tokenData = {
        jti: uuid(),
        iat: Date.now(),
        iss: opts.iss,
        sub: opts.sub,
        data: opts.data || ''
    }
    var expiry = ms(opts.exp || CONSTANTS.DEFAULT.TOKEN.EXP);
    var key = opts.key || CONSTANTS.DEFAULT.TOKEN.KEY
    if(!opts.key) log.warn(component, 'generating token with default key');
    ret = jwt.sign(tokenData, key, {expiresIn: expiry});
    log.close();
    return ret;
}

function decodeToken(token, key=CONSTANTS.DEFAULT.TOKEN.KEY) {
    const log = require('../util/logger').log(component, ___filename);
    if(key === CONSTANTS.DEFAULT.TOKEN.KEY) log.warn(component, 'decoding token using default key');
    // var key = key || CONSTANTS.DEFAULT.TOKEN.KEY
    log.close();
    return jwt.verify(token, key);
}

module.exports = {
    create: createToken,
    decode: decodeToken
}
