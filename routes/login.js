var express = require('express');
var router = express();

var user = {
    username: "admin",
    password: "admin"
};

router.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (username == user.username && password == user.password)
    res.send({status: "Login successful!"});
  else
    res.status(400).send("Invalid credentials!");
});

module.exports = router;
