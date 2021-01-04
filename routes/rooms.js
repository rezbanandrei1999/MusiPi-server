var express = require('express');
var router = express();

var rooms = [
  {
    id: 1,
    name: "Living Room",
    people: 3,
    active: true,
    pin: 10,
    connected: 2
  },
  {
    id: 2,
    name: "Bedroom",
    people: 0,
    active: true,
    pin: 11,
    connected: 1
  },
  {
    id: 3,
    name: "Kitchen",
    people: 2,
    active: false,
    pin: 12,
    connected: 1
  },

];
/* GET home page. */
router.get('/rooms', function(req, res) {
  res.send(rooms);
});

router.post('/rooms', function(req, res) {
  var id = rooms.length + 1;
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
  rooms.push(room);
  res.send(room);
});

router.post('/rooms/activate', function(req, res) {
  var id = Number(req.body.id);
  var active = (req.body.active == 'true');
  rooms.forEach( room => {
    if(room.id == id)
    {
      room.active = active;
      res.send(room);
    }
  })
});



module.exports = router;
