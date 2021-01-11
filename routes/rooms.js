var express = require('express');
var router = express();
var database = require('./connect.js');

router.get('/rooms', function(req, res) {

  var ref = database.ref("rooms");
  ref.once("value", function(snapshot) {
    var filtered = snapshot.val().filter(function (el) {
      return el != null;
    });
    res.send(filtered);
  });
});

router.post('/rooms', function(req, res) {
  var id = Number(req.body.id);
  var name = req.body.name;
  var pin = Number(req.body.pin);
  var people = 0;
  var active = true;
  var connected = Number(req.body.connected);

  var room = {
    id: id,
    name: name,
    people: people,
    active: active,
    pin: pin,
    connected: connected
  };
  var ref = database.ref("rooms");
  ref.child(id).set(room);
  res.send(room);
});

router.post('/rooms/activate', function(req, res) {
  var id = Number(req.body.id);
  var active = (req.body.active == 'true');
  var ref = database.ref("rooms");
  ref.child(id).update({ "active": active });

});

module.exports = router;
