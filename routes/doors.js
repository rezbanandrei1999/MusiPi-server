var express = require('express');
var router = express();
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

router.get('/doors', function(req, res) {
  var id = req.body.id;
  var response = [];
  async function run() {
    try {
      await client.connect();
      const doors = client.db("musipi").collection("doors");
      const filter = {$or: [
        {
          room_1: ObjectId(id)
        },
        {
          room_2: ObjectId(id)
        }
      ]}

      const cursor = doors.find(filter);

      await cursor.forEach(e => {
        response.push(e);
      });;
    } finally {
      res.send(response);
    }
  }
  run().catch(console.dir);
});

module.exports = router;
