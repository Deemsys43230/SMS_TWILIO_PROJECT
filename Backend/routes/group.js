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
    .post('/addToGroup', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
   
        // setup
        const log = require('../util/logger').log(component, ___filename);
        log.debug(component, 'User Add to Group');
        // extract
        var groupData = req.body;
        // groupData.groupId =  uuid.uid();
        groupApi.updateGroup(groupData, (err, group) => {
            if (err) {
                log.error(component, 'user updating to group error', { attach: err });
                log.close();
                res.json({status:false, err: ERR.MANDATORY_FIELD_MISSING
                     });
            } else {
                // extract into the sanitize method
                var ret = {
                    id: group.id,
                }
                log.debug(component, 'user added to group');
                log.trace(component, 'group:', { attach: group });
                log.close();
                return res.json({
                    status:true,
                    message: group
                });
            }
        });
    })
    .post('/removeContactFromGroup', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
   
        // setup
        const log = require('../util/logger').log(component, ___filename);
        log.debug(component, 'Remove Contact from group');
        // extract
        var groupData = req.body;
        // groupData.groupId =  uuid.uid();
        groupApi.removeUserFromGroup(groupData, (err, group) => {
            if (err) {
                log.error(component, 'remove Contcat group error', { attach: err });
                log.close();
                res.json({status:false, err: ERR.MANDATORY_FIELD_MISSING
                     });
            } else {
                // extract into the sanitize method
                var ret = {
                    id: group.id,
                }
                log.debug(component, 'Remove Contact from group');
                log.close();
                return res.json({
                    status:true,
                    message: "User Removed from Group!"
                });
            }
        });
    })
    .put('/:groupId',security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
        const log = require('../util/logger').log(component, ___filename);
        // extract
        var groupData = req.body;
        groupData.groupId = req.params.groupId;
        log.debug(component, 'updating group', { attach: groupData.groupId });
        log.close();

        groupApi.find.by.groupId(groupData, function (err, group) {
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
                    if(group.length ==0) {
                        log.debug(component, 'no group found', { attachInline: ERR.NO_SUCH_ID });
                        log.close();
                        res.json({status:false, err: ERR.NO_SUCH_ID });
                    } else {
                        // groupData.users = groupData.users.concat(group[0].users).unique()
                        // var mergeGroups = [];
                        // groupData.users.concat(group[0].users).forEach(userId =>{
                        //     if (mergeGroups.indexOf(userId) == -1) 
                        //     mergeGroups.push(userId); 
                        //  });
                        //  groupData.users = mergeGroups;
                        groupApi.update(groupData, function (err, group) {
                            if (err) {
                                log.error(component, 'update group error', { attach: err });
                                log.close();
                                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
                            } else {
                                log.debug(component, 'group updated');
                                log.close();
                                return res.json({
                                    status:true,
                                    message: "Group Updated Successfully!"
                                });
                            }
                        });
                    }
                }
            }
        });

    })
    .delete('/:groupId', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
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
                            message:"Group Deleted Successfully!" });
                        }
                    });
                }
            }
        });
    })
    .post('/search/groups', security.verifySecurity(["SMS_GENERATOR"]), (req, res) => {
        // setup
        const log = require('../util/logger').log(component, ___filename);
        log.debug(component, 'searching for all users', {attach:req.body});
        log.close();
        
        var searchData=req.body;
        groupApi.search(searchData, function (err, restaurants) {
            if (err) {
                log.error(component, 'find all restaurants error', { attach: err });
                log.close();
                return res.json({status:false, err: Object.assign(ERR.UNKNOWN, { message: err.message }) });
            } else {
                log.debug(component, `found ${restaurants.length} restaurants`);
                log.close();
                return res.json({
                    status:true,
                    data: restaurants
                });
            }
        });
    });

module.exports = router;
