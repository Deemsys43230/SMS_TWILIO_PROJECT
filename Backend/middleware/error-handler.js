const lodash=require('lodash');

function erroHandler(err,req,res,next){
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(200).json({status:false, message: err });
    }
    if(err.code){
        return res.status(200).json(lodash.merge({status:false},err));
    }
    if (err.name === 'JsonWebTokenError') {
        // jwt authentication error
        return res.status(401).json({status:false, message: 'Invalid Token' });
    }

    // default to 500 server error
    return res.status(500).json({status:false, message: err.message });
}

module.exports=erroHandler;