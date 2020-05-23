// Conatc

'use strict'
const mongoose=require('mongoose');

var contactSchema=new mongoose.Schema({ 
    userId:{type:String,required:true},
    name:{type:String, required:true},
    phoneNumber:{type:String,required:true},
    email:{type:String},
    groupId:{type:String}
},{
    collection:'contacts',
    versionKey:false
});

var model=mongoose.model('contacts',contactSchema);

module.exports=model;