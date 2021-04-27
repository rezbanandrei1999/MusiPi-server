var express = require('express');
var router = express();
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
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
      res.send({success: "Room was added!"});
    }
  }
  run().catch(console.dir);
});

router.post('/rooms/edit', function(req, res) {
  var id = req.body.id;
  var pin = Number(req.body.pin);
  var active = (req.body.active == 'true');
  var name = req.body.name;
  var people = req.body.people;

  async function run() {
    try {
      await client.connect();

      const rooms = client.db("musipi").collection("rooms");
      const filter = {'_id': ObjectId(id)}
      var room = await rooms.findOne(filter);
      if(!req.body.hasOwnProperty('pin'))
      {
        pin = room.pin;
      }
      if(!req.body.hasOwnProperty('active'))
      {
        active = room.active;
      }
      if(!req.body.hasOwnProperty('name'))
      {
        name = room.name;
      }
      if(!req.body.hasOwnProperty('people'))
      {
        people = room.people;
      }

      const update = { $set:
        {
          active: active,
          pin: pin,
          name: name,
          people: people
        } };

      await rooms.updateOne(filter, update);
    } finally {
      res.send({success: "Room status changed!"});
    }
  }
  run().catch(console.dir);
});

router.delete('/rooms/delete', function(req, res) {
  var id = req.body.id;

  async function run() {
    try {
      await client.connect();

      const rooms = client.db("musipi").collection("rooms");
      const doors = client.db("musipi").collection("doors");

      var filter = {'_id': ObjectId(id)}
      await rooms.deleteOne(filter);

      filter = {$or: [
        {
          room_1: ObjectId(id)
        },
        {
          room_2: ObjectId(id)
        }
      ]}
      await rooms.deleteMany(filter);
    } finally {
      res.send({success: "Room was deleted!"});
    }
  }
  run().catch(console.dir);
});

module.exports = router;
