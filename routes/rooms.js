let express = require('express')
let router = express()
let mysql = require('mysql')
let details = {
  host: "localhost",
  user: "root",
  password: "admin1234",
  database: "musipi"
}

router.get('/rooms', function(req, res) {
  req.body = JSON.parse(JSON.stringify(req.body));
  let con = mysql.createConnection(details)
  con.connect(function(err) {
    if (err) console.log(err)
    con.query("SELECT * FROM rooms", function (err, result, fields) {
      if (err) console.log(err)
      res.send(result)
    })
  })
})

router.post('/rooms', function(req, res) {
  req.body = JSON.parse(JSON.stringify(req.body));
  if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('pin'))
    res.status(400).send({error: "Room name and conection pin are required."})
  else
  {
    let people = 0;
    if (req.body.hasOwnProperty('people'))
      people = Number(req.body.people);
    let con = mysql.createConnection(details)
    let room = [[req.body.name, people, 1, Number(req.body.pin)]]
    con.connect(function(err) {
      if (err) console.log(err)
      let sql = "INSERT INTO rooms (name, people, active, pin) VALUES ?"
      con.query(sql, [room], function (err, result) {
        if (err) console.log(err)
        res.send({success: "Room was added!"})
      })
    })
  }
})

router.delete('/rooms', function(req, res) {
  req.body = JSON.parse(JSON.stringify(req.body));
  let id = req.body.id
  if (!req.body.hasOwnProperty('id'))
    res.status(400).send({error: "Room ID is required."})
  else
  {
    let con = mysql.createConnection(details)
    con.connect(function(err) {
      if (err) console.log(err)
      let sql = `DELETE FROM rooms WHERE id = ${id}`
      con.query(sql, function (err, result) {
        if (err) console.log(err)
        res.send({success: "Room was deleted!"})
      })
    })
  }
})

router.post('/rooms/edit', function(req, res) {
  req.body = JSON.parse(JSON.stringify(req.body));
  let id = Number(req.body.id)
  let pin = Number(req.body.pin)
  let active = Number(req.body.active)
  let name = req.body.name
  let people = req.body.people

  if (!req.body.hasOwnProperty('id') && !(req.body.hasOwnProperty('pin') || req.body.hasOwnProperty('active') || req.body.hasOwnProperty('name') || req.body.hasOwnProperty('people')))
    res.status(400).send({error: "Room ID and at least one update parameter are required."})
  else
  {
    let con = mysql.createConnection(details)
    con.connect(function(err) {
      if (err) console.log(err)

      let update = {
        name: name,
        people: people,
        active: active,
        pin: pin
      }
      let pin_string = "", active_string = "", name_string = "", people_string = ""

      if(req.body.hasOwnProperty('pin'))
        pin_string = `pin = ${update['pin']},`

      if(req.body.hasOwnProperty('active'))
        active_string = `active = ${update['active']},`

      if(req.body.hasOwnProperty('name'))
        name_string = `name = '${update['name']}',`

      if(req.body.hasOwnProperty('people'))
        people_string = `people = ${update['people']},`

      let sql = `UPDATE rooms SET ${name_string}${people_string}${active_string}${pin_string}`.slice(0,-1) + ` WHERE id = ${id}`
      con.query(sql, function (err, result) {
        if (err) console.log(err)
        res.send({success: "Room status changed!"})
      })
    })
  }
})

module.exports = router
