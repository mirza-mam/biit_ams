const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var Users = require('../Models/Users');


// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
    res.send('welcome, ' + req.body.username)
  })

app.get('/', function (req, res) {
  res.send( 'JSON.stringify(Users)'  );
  res.end();
})

app.get('/TeacherSchedule/:T_id', function (req, res) {
  console.log('although this matches')
  res.end();
})

app.listen(4000)