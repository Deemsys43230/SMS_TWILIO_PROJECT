const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    userName: {type:String, required:true},
    phoneNumber: {type:String, required: true},
    email: { type: String, required: true },
    password:{type:String, required: true},
    superPassword:{type:String, required:true},
    role: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }
}, {
    collection: 'user',
    versionKey: false
});


const model = mongoose.model('user', userSchema);
module.exports = model; 