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

module.exports = db;
