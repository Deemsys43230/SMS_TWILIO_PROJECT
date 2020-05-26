/**
 * templates model
 */
'use strict'
const mongoose = require('mongoose');

var templateSchema = new mongoose.Schema({
    templateId:{type:String,required:true},
    title: {type: String,required:true},
    template: {type: String,required:true},
}, {
    collection: 'template',
    versionKey: false
});

var model = mongoose.model('template', templateSchema);

module.exports = model;
