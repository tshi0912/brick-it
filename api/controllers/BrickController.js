/**
 * BrickController
 *
 * @module      :: Controller
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




    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to BrickController)
     */
    _config: {},

    index: function (req, res) {
        return res.view({
            navItem: 'bricks'
        });
    },

    edit: function (req, res) {
        return res.view({
            navItem: 'bricks'
        });
    },

    editFromMyself: function (req, res) {
        return res.view('brick/edit', {
            navItem: 'bricks',
            fromMyself: true,
            nickName: req.param('nickName')
        });
    },

    _create: function (req, res, createdByNickName, createdByEmail, completedUrl) {
        App.findOne()
            .where({ name: req.param('app') })
            .then(function (app) {

                Q.all(
                    // To save brick
                    Brick.create({
                        app: req.param('app'),
                        title: req.param('title'),
                        content: req.param('content'),
                        targetOwner: app.owner,
                        screenShots: req.param('screenShots') ? req.param('screenShots').split(',') : null,
                        createdByNickName: createdByNickName,
                        createdByEmail: createdByEmail,
                        createdAt: new Date()
                    }),
                    // To count brick
                    BrickDailyStat.findOne()
                        .where({
                            owner: createdByNickName,
                            targetDate: moment().startOf('day')
                        }).then(function (stat) {
                            if (stat) {
                                return stat.update({
                                    brickCount: stat.brickCount + 1
                                });
                            } else {
                                return BrickDailyStat.create({
                                    brickCount: 1,
                                    pendingCount: 0,
                                    owner: createdByNickName,
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
                                return stat.update({
                                    pendingCount: stat.pendingCount + 1
                                });
                            } else {
                                return BrickDailyStat.create({
                                    brickCount: 0,
                                    pendingCount: 1,
                                    owner: app.owner,
                                    targetDate: moment().startOf('day')
                                });
                            }
                        })
                ).done(function (results) {
                        res.redirect(completedUrl);
                    });

            });
    },

    createFromAdmin: function (req, res) {
        var createdByNickName = req.param('createdByNickName'),
            createdByEmail = req.param('createdByEmail');
        var record = {
            app: req.param('app'),
            title: req.param('title'),
            content: req.param('content'),
            screenShots: req.param('screenShots') ? req.param('screenShots').split(',') : null,
            createdByNickName: req.param('createdByNickName'),
            createdByEmail: req.param('createdByEmail')
        };
        BrickService.create(record)
            .done(function(results){
                res.redirect('/brick');
            });
    },

    createFromMyself: function (req, res) {
        var record = {
            app: req.param('app'),
            title: req.param('title'),
            content: req.param('content'),
            screenShots: req.param('screenShots') ? req.param('screenShots').split(',') : null,
            createdByNickName: req.session.user.nickName,
            createdByEmail: req.session.user.email
        };
        BrickService.create(record)
            .done(function(results){
                res.redirect('/user/' + req.session.user.nickName + '/requests' );
            });
    },

    destroy: function (req, res) {
        var ids = req.param('ids');
        Brick.findByIdIn(ids)
            .then(function (bricks) {
                var ds = [];
                bricks.forEach(function (brick) {
                    ds.push(Brick.destroy().where({id: brick.id}));
                });
                return Q.allSettled(ds);
            }).done(function (results) {
                var errors = [];
                results.forEach(function (result) {
                    if (result.state !== "fulfilled") {
                        errors.push(result.reason);
                    }
                });
                res.json({
                    ok: (errors.length == 0 ? true : false),
                    errors: errors
                });
            });
    },

    getBrickStat: function (req, res) {
        var max = moment().subtract(1, 'days').endOf('day'),
            min = max.subtract(30, 'days').startOf('day');

        BrickDailyStat.find()
            .where({
                owner: req.session.user.nickName,
                targetDate: { '<=': max},
                targetDate: { '>=': min}
            })
            .exec(function (err, stats) {
                // Error handling
                if (err) {
                    return console.log(err);
                }
                else {
                    res.json(stats);
                }
            })
    }

};
