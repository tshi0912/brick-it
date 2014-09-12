/**
 * UserController
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
     * (specific to UserController)
     */
    _config: {},

    index: function (req, res) {
        return res.view({
            navItem: 'users'
        });
    },

    dashboard: function (req, res) {
        var nickName = req.session.user.nickName;

        Q.all([User.findOne({
                nickName: nickName
            }), App.count({
                owner: nickName
            }), Brick.count({
                targetOwner: nickName
            }), Brick.count({
                createdByNickName: nickName
            })]).done(function(results){
            return res.view({
                appCount: results[1],
                brickCount: results[2],
                requestCount: results[3]
            });
        });
    },

    myBricks: function(req, res){
        return res.view({
            nickName: req.param('nickName')
        });
    },

    myRequests: function(req, res){
        return res.view({
            nickName: req.param('nickName')
        });
    },

    myApps: function(req, res){
        return res.view({
            nickName: req.param('nickName')
        });
    },

    signin: function (req, res) {
        User.findOne({
            nickName: req.param('nickName'),
            password: req.param('password')
        }).done(function (err, user) {
            // Error handling
            if (err) {
                return console.log(err);
            }
            // The Users was found out successfully
            else {
                if (!user) {
                    res.view('home/signin', {
                        errors: ['Nick name or password is incorrect.']
                    });
                } else {
                    req.session.authenticated = true;
                    req.session.user = user;
                    if (user.nickName === 'jim') {
                        req.session.admin = true;
                    }
                    res.redirect('/me');
                }
            }
        });
    },

    signout: function (req, res) {
        delete req.session.authenticated;
        delete req.session.user;
        delete req.session.admin;
        res.redirect('/signin');
    },

    edit: function (req, res) {
        return res.view({
            navItem: 'users'
        });
    },

    create: function (req, res) {
        User.create({
            nickName: req.param('nickName'),
            email: req.param('email'),
            password: req.param('password'),
            createdAt: new Date()
        }).done(function (err, user) {
            // Error handling
            if (err) {
                return console.log(err);
            }
            // The User was created successfully
            else {
                console.log("User created:", user);
            }
        });
        res.redirect('/');
    },

    destroy: function (req, res) {
        var ids = req.param('ids') || [];
        var ds = [];
        ids.forEach(function (id) {
            ds.push(User.destroy().where({id: id}));
        });
        Q.allSettled(ds).done(function (results) {
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
    }
};
