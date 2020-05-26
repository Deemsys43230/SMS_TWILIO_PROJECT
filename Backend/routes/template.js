/**
 * template routes
 */
'use strict'
const component = "Template";
const config = require('config');
const router = require('express').Router();
const ERR = require('../errors.json');
const templateApi = require('../api/templateApi');
const security=require('../util/security');
const uuid=require('../util/misc');

router
    .get('/', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
        // setup
        const log = require('../util/logger').log(component, ___filename);
        log.debug(component, 'searching for all templates');

        var opts = {
            maxResults: Number(req.query.num_results)
        };
        templateApi.find.all(opts, function (err, templates) {
            if (err) {
                log.error(component, 'find all templates error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } else {
                log.debug(component, `found ${templates.length} templates`);
                log.close();
                return res.json({
                    status:true,
                    data: templates
                });
            }
        });
    })
    .post('/', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
   
        // setup
        const log = require('../util/logger').log(component, ___filename);
        log.debug(component, 'creating new template');
        // extract
        var templateData = req.body;
        templateData.templateId = uuid.uid();
        templateApi.create(templateData, (err, template) => {
            if (err) {
                log.error(component, 'create new template error', { attach: err });
                log.close();
                res.json({status:false, err: ERR.MANDATORY_FIELD_MISSING
                     });
            } else {
                // extract into the sanitize method
                var ret = {
                    id: template.id,
                }
                log.debug(component, 'new template created');
                log.trace(component, 'template:', { attach: template });
                log.close();
                return res.json({
                    status:true,
                    message: "Template Created Successfully!"
                });
            }
        });
    })
    .get('/:templateId', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
        const log = require('../util/logger').log(component, ___filename);
        templateApi.find.by.id(req.params.templateId, function (err, template) {
            if (err) {
                log.error(component, 'find template by id error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } else {
                if(!template) {
                    log.debug(component, 'no template found', { attachInline: ERR.NO_SUCH_ID });
                    log.close();
                    res.json({status:false, err: ERR.NO_SUCH_ID });
                }
                else{
                    log.debug(component, 'template found:', { attach: template });
                    log.close();
                    return res.json({
                        status:true,
                        data: template
                    });
                }
            }
        });
    })
    .get('/getByStatus/:status', (req, res) => {
        const log = require('../util/logger').log(component, ___filename);
        templateApi.find.by.status(req.params.status, function (err, template) {
            if (err) {
                log.error(component, 'find template by status error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } else {
                if(!template) {
                    log.debug(component, 'no template found', { attachInline: ERR.NO_SUCH_ID });
                    log.close();
                    res.json({status:false, err: ERR.NO_SUCH_ID });
                }
                else{                  
                    return res.json({
                    status:true,  
                     data: template
                    });
                }
            }
        });
    })
    .post('/changeStatus', (req, res) => {
        const log = require('../util/logger').log(component, ___filename);
        // extract
        var templateData = req.body;

        log.debug(component, 'Change template Status', { attach: templateData.id });
        log.trace(component, 'template data:', { attach: templateData });
     
        templateApi.find.by.id(req.body.id, function (err, template) {
            if (err) {
                log.error(component, 'find template by id error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } 
            else {
                if(!template) {
                    log.debug(component, 'no template found', { attachInline: ERR.NO_SUCH_ID });
                    log.close();
                    res.json({status:false, err: ERR.NO_SUCH_ID });
                }
                else{
                    templateApi.update(templateData, function (err, template) {
                        if (err) {
                            log.error(component, 'Change template Status error', { attach: err });
                            log.close();
                            return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
                        } else {
                            log.debug(component, 'template status updated');
                            log.close();
                            return res.json({status:true,"message":"template Status Updated Successfully!"})
                        }
                    });
                }
            }
        })
    })
    .put('/:templateId', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
        const log = require('../util/logger').log(component, ___filename);
        // extract
        var templateData = req.body;
        templateData.id = req.params.templateId;
        log.debug(component, 'updating template', { attach: templateData.id });
        log.trace(component, 'template data:', { attach: templateData });

        templateApi.find.by.id(req.params.templateId, function (err, template) {
            if (err) {
                log.error(component, 'find template by id error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } 
            else {
                if(!template) {
                    log.debug(component, 'no template found', { attachInline: ERR.NO_SUCH_ID });
                    log.close();
                    res.json({status:false, err: ERR.NO_SUCH_ID });
                }
                else{
                    templateApi.update(templateData, function (err, template) {
                        if (err) {
                            log.error(component, 'update template error', { attach: err });
                            log.close();
                            return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
                        } else {
                            log.debug(component, 'template updated');
                            log.trace(component, 'template:', { attach: template });
                            log.close();
                            return res.json({
                                status:true,
                                message: "Template Updated Successfully!"
                            });
                        }
                    });
                }
            }
        });

    })
    .delete('/:templateId', (req, res) => {
        const log = require('../util/logger').log(component, ___filename);
        // extract
        var templateId = req.params.templateId;
        // @todo validate
        log.debug(component, 'deleting template', { attach: templateId });
        // delete
        templateApi.find.by.id(req.params.templateId, function (err, template) {
            if (err) {
                log.error(component, 'find template by id error', { attach: err });
                log.close();
                return res.json({ err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } else {
                if(!template) {
                    log.debug(component, 'no template found', { attachInline: ERR.NO_SUCH_ID });
                    log.close();
                    res.json({status:false, err: ERR.NO_SUCH_ID });
                }
                else{
                    templateApi.remove(templateId, function (err, templateId) {
                        if (err) {
                            log.error(component, 'delete template error', { attach: err });
                            log.close();
                            return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
                        } else {
                            log.debug(component, 'template deleted');
                            log.close();
                            return res.json({ status:true,
                            message:"Template Removed Successfully!" });
                        }
                    });
                }
            }
        });

    })

module.exports = router;
