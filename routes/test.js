var express = require('express');
var router = express();

router.get('/test', function(req, res) {
    res.send({success: "Test successful!"});
});

module.exports = router;
