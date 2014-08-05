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

    all: function (req, res) {
        var orders = req.param('order') || [];
        var columns = req.param('columns');
        var sort = '', length = parseInt(req.query['length']);

        for(var i=0; i<orders.length; i++){
            var c = orders[i]['column'];
            sort += columns[c]['data'] + ' ' + orders[i]['dir'];
            if(i != orders.length -1){
                sort += ',';
            }
        }

        console.log('sort=' + sort + ', limit=' + length);

        Brick.count(function(err, counts){
            // Error handling
            if (err) {
                return console.log(err);
            }
            // The Users was found out successfully
            else {
                Brick.find()
                    .sort(sort)
                    .skip(req.param('start'))
                    .limit(length)
                    .exec(function (err, bricks) {
                        // Error handling
                        if (err) {
                            return console.log(err);
                        }
                        // The bricks was found out successfully
                        else {
                            console.log("Find total ", bricks.length + ' bricks.');
                            res.json({
                                draw: req.param('draw'),
                                recordsTotal: counts,
                                recordsFiltered: counts,
                                data: bricks
                            });
                        }
                    });
            }
        })


    },

    edit : function(req, res){
        return res.view({
            navItem: 'bricks'
        });
    },

    create: function(req, res){
        Brick.create({
            title: req.param('title'),
            content: req.param('content'),
            targetOwner: 'jim',
            createdByNickName: req.param('createdByNickName'),
            createdByEmail: req.param('createdByEmail'),
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
        res.redirect('/brick');
    }

};
