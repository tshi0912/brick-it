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

    edit : function(req, res){
        return res.view({
            navItem: 'bricks'
        });
    },

    editFromMyself : function(req, res){
        return res.view('brick/edit', {
            navItem: 'bricks',
            fromMyself: true
        });
    },

    _create: function(req, res, createdByNickName,
                      createdByEmail,completedUrl){
        App.findOne()
            .where({ name: req.param('app') })
            .then(function(app){
                Brick.create({
                    app: req.param('app'),
                    title: req.param('title'),
                    content: req.param('content'),
                    targetOwner: app.owner,
                    screenShots: req.param('screenShots')? req.param('screenShots').split(',') : null,
                    createdByNickName: createdByNickName,
                    createdByEmail: createdByEmail,
                    createdAt: new Date()
                }).done(function(err, brick){
                    // Error handling
                    if (err) {
                        return console.log(err);
                    }
                    // The brick was created successfully
                    else {
                        console.log("brick created:", brick);
                    }
                });
                res.redirect(completedUrl);
            });
    },

    createFromAdmin: function(req, res){
        var createdByNickName = req.param('createdByNickName'),
            createdByEmail = req.param('createdByEmail');
        _create(req, res, createdByNickName, createdByEmail, '/brick');
    },

    createFromMyself: function(req, res){
        var createdByNickName = req.session.user.nickName,
            createdByEmail = req.session.user.email;
        _create(req, res, createdByNickName, createdByEmail, '/user/'+createdByNickName+'/requests');
    },

    destroy : function(req, res){
        var ids = req.param('ids');
        Brick.findByIdIn(ids)
            .then(function(bricks){
                var ds = []
                 bricks.forEach(function(brick){
                     ds.push(Brick.destroy().where({id : brick.id}));
                 });
                return Q.allSettled(ds);
            }).done(function(results){
                var errors = [];
                results.forEach(function (result) {
                    if (result.state !== "fulfilled") {
                        errors.push(result.reason);
                    }
                });
                res.json({
                    ok : (errors.length == 0 ? true : false),
                    errors : errors
                });
            });
    }

};
