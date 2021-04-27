var express = require('express');
var router = express();
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

router.get('/doors', function(req, res) {
  var response = []
  async function run() {
    try {
      await client.connect();

      const doors = client.db("musipi").collection("doors");
      const rooms = client.db("musipi").collection("rooms");
      const cursor = doors.find();
      const cursor2 = rooms.find();
      var rooms_map = new Map();

      await cursor2.forEach(e => {
        rooms_map[e._id] = e;
      });

      await cursor.forEach(e => {
        e.room_1 = rooms_map[e.room_1.toString()]
        e.room_2 = rooms_map[e.room_2.toString()]
        response.push(e);
      });
    } finally {
      res.send(response);
    }
  }
  run().catch(console.dir);
});

router.get('/doors/room', function(req, res) {
  var id = req.body.id;
  var response = [];
  var ids = [];
  if (!req.body.hasOwnProperty('id'))
    res.status(400).send({error: "Room ID is required."});
  else
  {
    async function run() {
      try {
        await client.connect();
        const doors = client.db("musipi").collection("doors");
        const rooms = client.db("musipi").collection("rooms");
        var filter = {$or: [
          {
            room_1: ObjectId(id)
          },
          {
            room_2: ObjectId(id)
          }
        ]}

        const cursor = await doors.find(filter);
        await cursor.forEach(e => {
          var aux = e.room_1;
          if (aux.toString() != id.toString())
            ids.push(aux);
          var aux = e.room_2;
          if (aux.toString() != id.toString())
            ids.push(aux);
        });

        filter = { _id: { $in: ids} }
        let map = new Map();
        await rooms.find(filter).forEach(e => {
          map[e._id] = e.name;
        });

        await cursor.forEach(e => {
          var aux = new Map();
          if(id === e.room_1)
          {
            aux["_id"] = e._id;
            aux["name"] = map[e.room_2.toString()];
            response.push(aux);
          }
          else
          {
            aux["_id"] = e._id;
            aux["name"] = map[e.room_1.toString()];
            response.push(aux);
          }
        });
      } finally {
        res.send(response);
      }
    }
    run().catch(console.dir);
  }
});

router.post('/doors', function(req, res) {
  var room_1 = req.body.room_1;
  var room_2 = req.body.room_2;
  if (!req.body.hasOwnProperty('room_1') || !req.body.hasOwnProperty('room_2'))
    res.status(400).send({error: "Room IDs are required."});
  else
  {
    var door = {
      room_1: room_1,
      room_2: room_2
    };

    async function run() {
      try {
        await client.connect();

        const doors = client.db("musipi").collection("doors");

        await doors.insertOne(door);
      } finally {
        res.send({success: "Door was added!"});
      }
    }
    run().catch(console.dir);
  }
});

router.delete('/doors/delete', function(req, res) {
  var id = req.body.id;
  if (!req.body.hasOwnProperty('id'))
    res.status(400).send({error: "Door ID is required."});
  else
  {
    async function run() {
      try {
        await client.connect();

        const doors = client.db("musipi").collection("doors");

        var filter = {_id: ObjectId(id)}
        await doors.deleteOne(filter);

      } finally {
        res.send({success: "Door was deleted!"});
      }
    }
    run().catch(console.dir);
  }
});

module.exports = router;
