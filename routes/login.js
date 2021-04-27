var express = require('express');
var router = express();

router.post('/login', function(req, res) {
  if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password'))
    res.status(400).send({error: "Invalid credentials!"});
  else
    if (req.body.username == "admin" && req.body.password == "admin")
      res.send({status: "Login successful!"});
    else
      res.status(400).send({error: "Invalid credentials!"});
});

module.exports = router;
