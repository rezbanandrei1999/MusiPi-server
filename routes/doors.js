let express = require('express')
let router = express()
let mysql = require('mysql')
let details = {
  host: "localhost",
  user: "root",
  password: "admin1234",
  database: "musipi"
}

router.get('/doors', function(req, res) {
  req.body = JSON.parse(JSON.stringify(req.body));
  let con = mysql.createConnection(details)
  con.connect(function(err) {
    if (err) console.log(err)
    let sql = "SELECT d.id AS id, r1.name as room_1, r2.name as room_2 FROM doors AS d INNER JOIN rooms AS r1 ON r1.id = d.room_1 INNER JOIN rooms AS r2 ON r2.id = d.room_2"
    con.query(sql, function (err, result, fields) {
      if (err) console.log(err)
      res.send(result)
    })
  })
})

router.post('/doors', function(req, res) {
  req.body = JSON.parse(JSON.stringify(req.body));
  let room_1 = req.body.room_1
  let room_2 = req.body.room_2
  if (!req.body.hasOwnProperty('room_1') || !req.body.hasOwnProperty('room_2'))
    res.status(400).send({error: "Room IDs are required."})
  else
  {
    let con = mysql.createConnection(details)
    let door = [[room_1, room_2]]
    con.connect(function(err) {
      if (err) console.log(err)
      let sql = "INSERT INTO doors (room_1, room_2) VALUES ?";
      con.query(sql, [door], function (err, result) {
        if (err) console.log(err)
        res.send({success: "Door was added!"})
      })
    })
  }
})

router.delete('/doors', function(req, res) {
  req.body = JSON.parse(JSON.stringify(req.body));
  let id = req.body.id
  if (!req.body.hasOwnProperty('id'))
    res.status(400).send({error: "Door ID is required."})
  else
  {
    let con = mysql.createConnection(details)
    con.connect(function(err) {
      if (err) console.log(err)
      let sql = `DELETE FROM doors WHERE id = ${id}`
      con.query(sql, function (err, result) {
        if (err) console.log(err)
        res.send({success: "Door was deleted!"});
      })
    })
  }
})

module.exports = router
