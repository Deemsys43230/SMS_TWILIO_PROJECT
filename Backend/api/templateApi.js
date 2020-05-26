/**
 * template API
 */
'use strict';
const component = "Template";
const model = require('../models/template');

var create = function (data, cb) {
    // setup
    const log = require('../util/logger').log(component, ___filename);

    log.debug(component, 'template data', { attachInline: data });
    // hash the password
    
    var templateModel = new model(data);
    templateModel.save()
        .then(template => {
            log.debug(component, 'new template created:', { attachInline: template });
            log.close();
            return cb(null, template);
        })
        .catch(err => {
            log.error(component, 'create template error', { attach: err });
            log.close();
            return cb(err);
        });
};



var update = function(data, cb) {
    const log = require('../util/logger').log(component, ___filename);
    log.debug(component, 'updating template', { attach: data.id });
    
    model.findOneAndUpdate({ templateId: data.id }, data,  (err, template) => {
        if (err) {
            log.error(component, 'update template error', { attach: err });
            log.close();
            return cb(err);
        }
        log.debug(component, 'template updated', {attach: template});
        log.close();
        return cb(null, template);
    });
};


var remove = function (templateId, cb) {
    // setup
    const log = require('../util/logger').log(component, ___filename);
    log.debug(component, 'removing template', { attach: templateId });
    model.remove({ templateId: templateId })
        .then(template => {
            log.debug(component, 'template removed', { attach: template.result });
            log.close();
            return cb(null, template);
        })
        .catch(err => {
            log.error(component, 'remove template error', { attach: err });
            log.close();
            return cb(err);
        });
};


var find = {
    /**
     * find all templates
     * @param {Object} opts - search options
     * @param {number} opts.maxResults - max number of templates to return
     * @async
     */
    all: function (opts, cb) {
        var ret;
        const log = require('../util/logger').log(component, ___filename);
        log.debug(component, 'searching for all templates');
        var query = {};
        model.find(query)
            .then(templates => {
                log.debug(component, `retrieved ${templates.length} templates`);
                log.close();
                return cb(null, templates);
            })
            .catch(err => {
                log.error(component, 'find all templates error', { attach: err });
                log.close();
                return cb(err);
            })
    },
    by: {
        /**
         * find templates by id
         * @param {String} id - template id
         * @async
         */
        id: function (id, cb) {
            const log = require('../util/logger').log(component, ___filename);
            log.debug(component, 'searching for template id', { attach: id });
            var query = { templateId: id };
            log.debug(component, 'search template', { attach: query });
            model.findOne(query)
                .then(template => {
                    if (!template) log.debug(component, `no template found ${id}`);
                    else {  
                        log.debug(component, `${template.length} template found`);
                        log.trace(component, 'template found');
                        log.close();
                    }
                    return cb(null, template);
                })
                .catch(err => {
                    log.error(component, 'find all template error', { attach: err });
                    log.close();
                    return cb(err);
                })
        },
        status: function (status, cb) {
            const log = require('../util/logger').log(component, ___filename);
            var query = { 'active': status };
            if(status==-1)
                query = {};
            model.find(query)
            .then(template => {
                log.debug(component, `retrieved ${template.length} templates`);
                log.close();
                return cb(null, template);
            })
            .catch(err => {
                log.error(component, 'find all templates error', { attach: err });
                log.close();
                return cb(err);
            })
        },
    }
};


module.exports = {
    find: find,
    create: create,
    update: update,
    remove: remove,
};
