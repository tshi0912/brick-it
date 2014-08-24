
module.exports = {

    _config: {},

    uptoken: function(req, res){
        res.header("Cache-Control", "max-age=0, private, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);
        var token = QiniuStorage.getToken();
        if (token) {
            res.json({
                uptoken: token
            });
        }
    }
};