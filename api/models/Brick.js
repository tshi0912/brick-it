/**
 * Brick
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

        title: {
            type: 'string',
            required: true
        },

        content: {
            type: 'text',
            required: true
        },

        createdByEmail: {
            // Special types are allowed, they are used in validations and
            // set as a string when passed to an adapter
            type: 'email',
            required: true
        },

        createdByNickName: {
            // Special types are allowed, they are used in validations and
            // set as a string when passed to an adapter
            type: 'string'
        },

        createdAt: {
            type: 'datetime',
            required: true
        }

    }

};
