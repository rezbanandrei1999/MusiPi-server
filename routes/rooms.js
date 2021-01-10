var express = require('express');
var router = express();

var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require("./musipi-firebase-adminsdk-e53ur-adb70f62fb.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://musipi-default-rtdb.firebaseio.com/"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();

router.get('/rooms', function(req, res) {

  var ref = db.ref("rooms");
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
  var ref = db.ref("rooms");
  ref.child(id).set(room);
  res.send(room);
});

router.post('/rooms/activate', function(req, res) {
  var id = Number(req.body.id);
  var active = (req.body.active == 'true');
  var ref = db.ref("rooms");
  ref.child(id).update({ "active": active });

});

module.exports = router;
