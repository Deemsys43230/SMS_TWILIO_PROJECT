const csvparser = require("csv-validator");
const shapetojson = require("shape-json");
const _ = require("underscore");
const csv = require('csv-validator');

function processCSVFile(filePath, cb) {

    const headers = {
        Name: '', // any string
        Mobile: 1, // any number
    };
     
    csv(filePath, headers)
    .then(data => {
        csvparser(filePath).then((result)=>{ 
            var scheme = {
                "$mirror[contacts](Name)": {
                    "name": "Name",
                    "phoneNumber": "Mobile",
                    "email":"Email"
                }
            }
            var data = shapetojson.parse(result.slice(0), scheme);
            return cb(null, data)
        }).catch(err=>{
            return cb(err, null);  
        });
    })
    .catch(err => {
        return cb(err, null);  
    })
    
}

module.exports = {
    processCSVFile: processCSVFile
}
