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

module.exports = {




    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to UserController)
     */
    _config: {},

    index: function (req, res) {
        return res.view();
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
                if(!user){
                    res.view('home/signin',{
                        errors: ['Nick name or password is incorrect.']
                    });
                }else{
                    res.redirect('/');
                }
            }
        });
    },

    all: function (req, res) {
        var orders = req.param('order') || [];
        var columns = req.param('columns');
        var sort = '', length = parseInt(req.query['length']);

        for (var i = 0; i < orders.length; i++) {
            var c = orders[i]['column'];
            sort += columns[c]['data'] + ' ' + orders[i]['dir'];
            if (i != orders.length - 1) {
                sort += ',';
            }
        }

        console.log('sort=' + sort + ', limit=' + length);

        User.count(function (err, counts) {
            // Error handling
            if (err) {
                return console.log(err);
            }
            // The Users was found out successfully
            else {
                User.find()
                    .sort(sort)
                    .skip(req.param('start'))
                    .limit(length)
                    .exec(function (err, users) {
                        // Error handling
                        if (err) {
                            return console.log(err);
                        }
                        // The Users was found out successfully
                        else {
                            console.log("Find total ", users.length + ' users.');
                            res.json({
                                draw: req.param('draw'),
                                recordsTotal: counts,
                                recordsFiltered: counts,
                                data: users
                            });
                        }
                    });
            }
        })


    },

    edit: function (req, res) {
        return res.view();
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
    }
};
