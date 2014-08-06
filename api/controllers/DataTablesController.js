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

    query: function(req, res){

        var modelMapping = {
            'users' : User,
            'bricks' : Brick,
            'apps' : App
        };

        var model = req.param('model'),
            where = req.param('where'),
            orders = req.param('order') || [],
            columns = req.param('columns'),
            skip = req.param('start'),
            length = parseInt(req.body['length']),
            sort = {};

        for(var i=0; i<orders.length; i++){
            var c = orders[i]['column'];
            sort[columns[c]['data']] = orders[i]['dir'] === 'asc' ? 1 : 0;
        }

        console.log('model=' + model +
            ', where=' + where +
            ', sort=' + sort +
            ', skip=' + skip +
            ', limit=' + length);

        var Clazz = modelMapping[model];

        Q.all([
            Clazz.count(where),
            Clazz.find({
                where : where,
                sort : sort,
                skip : skip,
                limit : length
            })
        ])
            .done(function(results){
                console.log("Find total ", results[1].length +' ' + model + '.');
                res.json({
                    draw: req.param('draw'),
                    recordsTotal: results[0],
                    recordsFiltered: results[0],
                    data: results[1]
                });
            });
    }
};