var express = require('express');
var router = express();
const { MongoClient } = require("mongodb");
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

router.get('/rooms', function(req, res) {

  var response = []
  async function run() {
    try {
      await client.connect();

      const rooms = client.db("musipi").collection("rooms");
      const cursor = rooms.find();

      await cursor.forEach(e => {
        response.push(e);
      });;
    } finally {
      res.send(response);
    }
  }
  run().catch(console.dir);
});

router.post('/rooms', function(req, res) {
  var name = req.body.name;
  var pin = Number(req.body.pin);
  var people = 0;
  var active = true;

  var room = {
    name: name,
    people: people,
    active: active,
    pin: pin
  };

  async function run() {
    try {
      await client.connect();

      const rooms = client.db("musipi").collection("rooms");

      await rooms.insertOne(room);
    } finally {
      res.send(room);
    }
  }
  run().catch(console.dir);
});

router.post('/rooms/activate', function(req, res) {
  var pin = Number(req.body.pin);
  var active = (req.body.active == 'true');

  async function run() {
    try {
      await client.connect();

      const rooms = client.db("musipi").collection("rooms");
      const filter = {pin: pin}
      const update = { $set: { active: active } };

      await rooms.updateOne(filter, update);
    } finally {
      res.send({success: "Room status changed!"});
    }
  }
  run().catch(console.dir);
});

module.exports = router;
