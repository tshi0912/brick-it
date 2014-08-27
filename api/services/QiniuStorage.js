/**
 * Brick
 *
 * @module      :: Service
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = 'L72jD_eA8wIaRS_lzUsjKlxSrj2ynVrqe3SpJ-F6';
qiniu.conf.SECRET_KEY = '4TvHa5E_8nMprK-mXpTTTI2wKfqfc0ZdwZJGJ8xK';

var putPolicy = new qiniu.rs.PutPolicy('brickit');

module.exports = {

    getToken: function () {
        return putPolicy.token();
    }

};