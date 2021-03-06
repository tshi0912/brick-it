/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

    // User is allowed, proceed to the next policy,
    // or if this is the last policy, the controller
    var nickName = req.param('nickName');
    if(req.session.user.nickName === nickName) {
        return next();
    }else{
        // User is not allowed
        // (default res.forbidden() behavior can be overridden in `config/403.js`)
        res.forbidden('You do not have the access right')
    }
};
