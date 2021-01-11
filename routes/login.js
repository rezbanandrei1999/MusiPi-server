var express = require('express');
var router = express();
var database = require('./connect.js');

router.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var ref = database.ref("user/admin");
  ref.once("value", function(snapshot) {
    var u = snapshot.child("username").val();
    var p = snapshot.child("password").val();
    if (username == u && password == p)
      res.send({status: "Login successful!"});
    else
      res.status(400).send({"error": "Invalid credentials!"});
  });
});

module.exports = router;
