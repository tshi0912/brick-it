/**
 * BrickDailyStats
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        brickCount: {
            type: 'integer',
            required: true
        },

        pendingCount: {
            type: 'integer',
            required: true
        },

        owner: {
            type: 'string',
            required: true
        },

        targetDate: {
            type: 'datetime',
            required: true
        }

    }

};
