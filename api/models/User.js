/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        /* e.g.
         nickname: 'string'
         */
        nickName: {
            type: 'string',
            required: true
        },

        email: {
            type: 'email',
            required: true
        },

        password: {
            type: 'string',
            required: true
        },

        createdAt: {
            type: 'datetime',
            required: true
        }
    }

};
