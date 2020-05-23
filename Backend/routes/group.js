/**
 * group routes
 */
'use strict'
const component = "ROUTER";
const config = require('config');
const router = require('express').Router();
const ERR = require('../errors.json');
const groupApi = require('../api/group');
const uuid=require('../util/misc');
const security=require('../util/security');

router
    .get('/', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
        // setup
        const log = require('../util/logger').log(component, ___filename);
        log.debug(component, 'searching for all groups');

        var opts = {
            maxResults: Number(req.query.num_results)
        };
        groupApi.find.all(opts, function (err, groups) {
            if (err) {
                log.error(component, 'find all groups error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } else {
                log.debug(component, `found ${groups.length} groups`);
                log.close();
                return res.json({
                    status:true,
                    data: groups
                });
            }
        });
    })
    .post('/', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
   
        // setup
        const log = require('../util/logger').log(component, ___filename);
        log.debug(component, 'creating new group');
        // extract
        var groupData = req.body;
        groupData.groupId =  uuid.uid();
        groupApi.create(groupData, (err, group) => {
            if (err) {
                log.error(component, 'create new group error', { attach: err });
                log.close();
                res.json({status:false, err: ERR.MANDATORY_FIELD_MISSING
                     });
            } else {
                // extract into the sanitize method
                var ret = {
                    id: group.id,
                }
                log.debug(component, 'new group created');
                log.trace(component, 'group:', { attach: group });
                log.close();
                return res.json({
                    status:true,
                    message: "Group Created Successfully!"
                });
            }
        });
    })
    .get('/:groupId', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
        const log = require('../util/logger').log(component, ___filename);
        groupApi.find.by.id(req.params.groupId, function (err, group) {
            if (err) {
                log.error(component, 'find group by id error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } else {
                if(!group) {
                    log.debug(component, 'no group found', { attachInline: ERR.NO_SUCH_ID });
                    log.close();
                    res.json({status:false, err: ERR.NO_SUCH_ID });
                }
                else{
                    log.debug(component, 'group found:', { attach: group });
                    log.close();
                    return res.json({
                        status:true,
                        data: group
                    });
                }
            }
        });
    })
    .get('/getByStatus/:status', (req, res) => {
        const log = require('../util/logger').log(component, ___filename);
        groupApi.find.by.status(req.params.status, function (err, group) {
            if (err) {
                log.error(component, 'find group by status error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } else {
                if(!group) {
                    log.debug(component, 'no group found', { attachInline: ERR.NO_SUCH_ID });
                    log.close();
                    res.json({status:false, err: ERR.NO_SUCH_ID });
                }
                else{                  
                    return res.json({
                    status:true,  
                     data: group
                    });
                }
            }
        });
    })
    .post('/changeStatus', (req, res) => {
        const log = require('../util/logger').log(component, ___filename);
        // extract
        var groupData = req.body;

        log.debug(component, 'Change group Status', { attach: groupData.id });
        log.trace(component, 'group data:', { attach: groupData });
     
        groupApi.find.by.id(req.body.id, function (err, group) {
            if (err) {
                log.error(component, 'find group by id error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } 
            else {
                if(!group) {
                    log.debug(component, 'no group found', { attachInline: ERR.NO_SUCH_ID });
                    log.close();
                    res.json({status:false, err: ERR.NO_SUCH_ID });
                }
                else{
                    groupApi.update(groupData, function (err, group) {
                        if (err) {
                            log.error(component, 'Change group Status error', { attach: err });
                            log.close();
                            return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
                        } else {
                            log.debug(component, 'group status updated');
                            log.close();
                            return res.json({status:true,"message":"group Status Updated Successfully!"})
                        }
                    });
                }
            }
        })
    })
    .put('/:groupId', (req, res) => {
        const log = require('../util/logger').log(component, ___filename);
        // extract
        var groupData = req.body;
        groupData.id = req.params.groupId;
        log.debug(component, 'updating group', { attach: groupData.id });
        log.trace(component, 'group data:', { attach: groupData });

        groupApi.find.by.id(req.params.groupId, function (err, group) {
            if (err) {
                log.error(component, 'find group by id error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } 
            else {
                if(!group) {
                    log.debug(component, 'no group found', { attachInline: ERR.NO_SUCH_ID });
                    log.close();
                    res.json({status:false, err: ERR.NO_SUCH_ID });
                }
                else{
                    groupApi.update(groupData, function (err, group) {
                        if (err) {
                            log.error(component, 'update group error', { attach: err });
                            log.close();
                            return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
                        } else {
                            log.debug(component, 'group updated');
                            log.trace(component, 'group:', { attach: group });
                            log.close();
                            return res.json({
                                status:true,
                                message: "Group Updated Successfully!"
                            });
                        }
                    });
                }
            }
        });

    })
    .post('/:groupId', (req, res) => {
        const log = require('../util/logger').log(component, ___filename);
        // extract
        var groupId = req.params.groupId;
        // @todo validate
        log.debug(component, 'deleting group', { attach: groupId });
        // delete
        groupApi.find.by.id(req.params.groupId, function (err, group) {
            if (err) {
                log.error(component, 'find group by id error', { attach: err });
                log.close();
                return res.json({ err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } else {
                if(!group) {
                    log.debug(component, 'no group found', { attachInline: ERR.NO_SUCH_ID });
                    log.close();
                    res.json({status:false, err: ERR.NO_SUCH_ID });
                }
                else{
                    groupApi.remove(groupId, function (err, groupId) {
                        if (err) {
                            log.error(component, 'delete group error', { attach: err });
                            log.close();
                            return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
                        } else {
                            log.debug(component, 'group deleted');
                            log.close();
                            return res.json({ status:true,
                            message:"group removed" });
                        }
                    });
                }
            }
        });

    })

module.exports = router;
