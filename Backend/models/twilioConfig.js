// Message Send Settings

'use strict'
const mongoose=require('mongoose');


var twilioSettingSchema=new mongoose.Schema({ 
    id:{type:String,required:true},
    accountSid:{type:String,required:true},
    authToken:{type:String,required:true},
    fromPhone:{type:String,required:true},
    cellPhonePrefix:{type:String, required:true}
},{
    collection:'twilioSettings',
    versionKey:false
});

var model=mongoose.model('twilioSetting',twilioSettingSchema);

module.exports=model;