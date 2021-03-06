/**
 * Security utils
 */
'use strict'
const crypto = require('crypto');
const CONSTANTS = require('./constants.json');
const jwt = require('jsonwebtoken');

function hash(data) {
    return data ? crypto.createHash('md5').update(data).digest('hex') : undefined;
}

function verifySecurity(roles=[]){
    if(typeof roles==='string'){
        roles=[roles];
    }
    return function(req,res,next){
        var token = req.headers['authorization'];
        
        if(token!=undefined){
            token=token.replace(/^Bearer\s/, '');
            jwt.verify(token, CONSTANTS.DEFAULT.TOKEN.KEY, function(err, decoded) {
                if (err) {
                    res.status(403).send({"request_status":false,"status":false,"auth":false, "error": 'Failed to authenticate token.' });
                }else{
                    req.user={
                        "userId":decoded.data[0].userId,
                        "role":decoded.data[0].role
                    };
                    if(roles.length && !roles.includes(req.user.role)){
                       return res.status(403).json({"request_status":false,"status":false,"auth":false,"error":"forbidden"});
                    }
                        next();
                }             
            });
        }else{
            res.status(403).json({"request_status":false,"status":false,"auth":false,"error":"Unauthorized"});
        }
    }    
}

//Parse Token
function isLogged(req, res, roles=[]){

    if(typeof roles==='string'){
        roles=[roles];
    }
    return function(req,res,next){
        var token = req.headers['authorization'];        
        if(token!=undefined){
            token=token.replace(/^Bearer\s/, '');
            jwt.verify(token, CONSTANTS.DEFAULT.TOKEN.KEY, function(err, decoded) {
                if (err) {
                    res.status(403).send({"request_status":false,"status":false,"auth":false, "error": 'Failed to authenticate token.' });
                }else{
                    req.user={
                        "userId":decoded.data.userId,
                        //"institutionId":decoded.data.institutionId,
                        "role":decoded.data.role,
                        "restId": decoded.data.restId
                    };
                    next();
                }             
            });
        }else{
            req.user={
                "userId":null,
                //"institutionId":decoded.data.institutionId,
                "role":null,
                "restId": null
            }
            next();
        }
    }
}   


module.exports = {
    hash: hash,
    verifySecurity:verifySecurity,
    isLogged:isLogged
}
