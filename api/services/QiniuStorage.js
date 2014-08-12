/**
 * Brick
 *
 * @module      :: Service
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var qn = require('qn');

var client = qn.create({
    accessKey: 'L72jD_eA8wIaRS_lzUsjKlxSrj2ynVrqe3SpJ-F6',
    secretKey: '4TvHa5E_8nMprK-mXpTTTI2wKfqfc0ZdwZJGJ8xK',
    bucket: 'brickit',
    domain: 'http://brickit.qiniudn.com'
});

module.exports = {

    put: function (file) {
        client.uploadFile(file, {
                key: 'qn/lib/client.js'
            },
            function (err, result) {
                console.log(result);
                // {
                //   hash: 'FhGbwBlFASLrZp2d16Am2bP5A9Ut',
                //   key: 'qn/lib/client.js',
                //   url: 'http://qtestbucket.qiniudn.com/qn/lib/client.js'
                //   "x:ctime": "1378150371",
                //   "x:filename": "client.js",
                //   "x:mtime": "1378150359",
                //   "x:size": "21944",
                // }
            });
    }

};