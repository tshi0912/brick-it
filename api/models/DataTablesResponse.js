/**
 * Brick
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes : {

        draw : {
            type: 'integer',
            required: true
        },

        recordsTotal : {
            type: 'integer',
            required: true
        },

        recordsFiltered: {
            type: 'integer',
            required: true
        },

        data : {
            type: 'array',
            required: true
        }
    }
};