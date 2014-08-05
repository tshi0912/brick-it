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

module.exports = {




    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to ApplicationController)
     */
    _config: {},

    queryBySingleProp: function (req, res) {

        var prop = req.param('prop'),
            value = req.param('value');
        var orders = req.param('order') || [];
        var columns = req.param('columns');
        var sort = {}, length = parseInt(req.query['length']), where = {};

        for (var i = 0; i < orders.length; i++) {
            var c = orders[i]['column'];
            sort[columns[c]['data']] = orders[i]['dir'] === 'asc' ? 1 : 0;
        }

        where[prop] = value;

        console.log('sort=' + sort + ', limit=' + length + ', where=' + where);

        Q.all([
            Application.count(where),
            Application.find({
                where: where,
                sort: sort,
                skip: req.param('start'),
                limit: length
            })
        ])
            .done(function (results) {
                console.log("Find total ", results[1].length + ' apps.');
                res.json({
                    draw: req.param('draw'),
                    recordsTotal: results[0],
                    recordsFiltered: results[0],
                    data: results[1]
                });
            });

    }

};
