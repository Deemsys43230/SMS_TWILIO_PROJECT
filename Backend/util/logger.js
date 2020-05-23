/**
 * logging utils
 */
'use strict'
const config = require('config');
const { addListener } = require('storyboard');

require('storyboard-preset-console');

var log = function(component, filename) {
    return require('storyboard').mainStory.child({ src: component, title: filename });
}

module.exports = {
    log: log
}
