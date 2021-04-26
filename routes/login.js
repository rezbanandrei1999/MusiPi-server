var express = require('express');
var router = express();

router.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (username == "admin" && password == "admin")
    res.send({status: "Login successful!"});
  else
    res.status(400).send({error: "Invalid credentials!"});

});

module.exports = router;
