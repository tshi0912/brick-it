/**
 * BrickService
 *
 * @module      :: Service
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var Q = require('q');
var moment = require('moment');

module.exports = {

    create: function (record) {
        return App.findOne()
            .where({ name: record.app })
            .then(function (app) {

                // update the target owner
                record.targetOwner = app.owner;

                // save it
                return Q(Brick.create(record))
                    .then(function (brick) {
                        console.log('create brick successfully ' + brick);
                        return Q.allSettled([
                            // To count brick
                            BrickDailyStat.findOne()
                                .where({
                                    owner: brick.targetOwner,
                                    targetDate: moment().startOf('day')
                                }).then(function (stat) {
                                    if (stat) {
                                        return BrickDailyStat.update({
                                            id: stat.id
                                        },{
                                            brickCount: stat.brickCount+1
                                        });
                                    } else {
                                        return BrickDailyStat.create({
                                            brickCount: 1,
                                            pendingCount: 0,
                                            owner: brick.targetOwner,
                                            targetDate: moment().startOf('day')
                                        });
                                    }
                                }),
                            // To count pending
                            BrickDailyStat.findOne()
                                .where({
                                    owner: app.owner,
                                    targetDate: moment().startOf('day')
                                }).then(function (stat) {
                                    if (stat) {
                                        return BrickDailyStat.update({
                                            id: stat.id
                                        },{
                                            pendingCount: stat.pendingCount+1
                                        });
                                    } else {
                                        return BrickDailyStat.create({
                                            brickCount: 0,
                                            pendingCount: 1,
                                            owner: app.owner,
                                            targetDate: moment().startOf('day')
                                        });
                                    }
                                })]);
                    })
                    .spread(function (brick, pending) {

                        if (brick.state !== "fulfilled") {
                            console.log('brick count create failed with ' + brick.reason);
                        }else{
                            console.log('brick count create successfully' + brick.value);
                        }

                        if (pending.state !== "fulfilled") {
                            console.log('pending count create failed with ' + pending.reason);
                        }else{
                            console.log('pending count create successfully' + pending.value);
                        }

                        return [brick, pending];
                    });

            });
    }

};