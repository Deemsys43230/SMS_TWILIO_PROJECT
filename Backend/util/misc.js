/**
 * Misc. utils
 */
'use strict'
var uuid = require('uuid');

function uid() {
    return uuid.v1().replace(/\-/g, '');
}

module.exports = {
    uid: uid
}
