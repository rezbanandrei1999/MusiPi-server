var express = require('express');
var router = express();

router.get('/rooms', function(req, res) {

  const { MongoClient } = require("mongodb");
  const uri = 'mongodb://127.0.0.1:27017';

  const client = new MongoClient(uri);

  async function run() {
    try {
      await client.connect();

      const database = client.db("musipi");
      const rooms = database.collection("rooms");

      // query for movies that have a runtime less than 15 minutes
      const query = { runtime: { $lt: 15 } };

      const options = {
        // sort returned documents in ascending order by title (A->Z)
        sort: { title: 1 },
      // Include only the `title` and `imdb` fields in each returned document
        projection: { _id: 0, title: 1, imdb: 1 },
      };

      const cursor = rooms.find();

      var response = []
      await cursor.forEach(element => {
          response.push(element);
      });;

      res.send(response);
    } finally {
      await client.close();
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
  const { MongoClient } = require("mongodb");
  const uri = 'mongodb://127.0.0.1:27017';

  const client = new MongoClient(uri);

  async function run() {
    try {
      await client.connect();

      const database = client.db("musipi");
      const rooms = database.collection("rooms");
      await rooms.insertOne(room)
    } finally {
      res.send(room);
      await client.close();
    }
  }
  run().catch(console.dir);
});

router.post('/rooms/activate', function(req, res) {
  var id = Number(req.body.id);
  var active = (req.body.active == 'true');
  var ref = database.ref("rooms");
  ref.child(id).update({ "active": active });
  res.send({success: "Room status changed!"});
});

module.exports = router;
