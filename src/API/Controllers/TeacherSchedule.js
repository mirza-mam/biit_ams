const express = require('express')
const app = express()
var TeacherSchedule = require('../Models/TeacherSchedule');

app.get('/', function (req, res) {
  res.write( TeacherSchedule )
  res.end();
})

app.get('/TeacherSchedule/:T_id', function (req, res) {
  console.log('although this matches')
  res.end();
})

app.listen(4000)