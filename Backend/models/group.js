// Conatc

'use strict'
const mongoose=require('mongoose');

var groupSchema=new mongoose.Schema({ 
    groupName:{type:String, required:true},
    groupId:{type:String, required:true}
},{
    collection:'groups',
    versionKey:false
});

var model=mongoose.model('groups',groupSchema);

module.exports=model;