/**
 * ApplicationController
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
var uuid = require('node-uuid');

module.exports = {


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to ApplicationController)
     */
    _config: {},

    index: function (req, res) {
        return res.view({
            navItem: 'apps'
        });
    },

    edit: function (req, res) {
        return res.view({
            navItem: 'apps'
        });
    },

    getByName: function(req, res){
        App.findOneByName(req.param('name'))
            .done(function(err, app){
                // Error handling
                if (err) {
                    return console.log(err);
                }
                // The app was find out successfully
                else {
                    res.json(app);
                }
            });
    },

    create: function (req, res) {
        App.create({
            name: req.param('name'),
            domain: req.param('domain'),
            key: uuid.v4(),
            owner: req.session.user.nickName
        }).done(function (err, app) {
            // Error handling
            if (err) {
                return console.log(err);
            }
            // The brick was created successfully
            else {
                console.log("app created:", app);
            }
        });
        res.redirect('/app');
    },

    destroy: function (req, res) {
        var ids = req.param('ids') || [];
        var ds = [];
        ids.forEach(function (id) {
            ds.push(App.destroy().where({id: id}));
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
