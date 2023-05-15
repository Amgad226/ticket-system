var express = require('express');
var router = express.Router();
const fs = require('fs')
const path= require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  var filePath = path.join(__dirname,'../', 'public/events.html',);
  res.sendFile(filePath);

  // res.render('index', { title: 'Express' });
  // return res.send("<h1>hi there </h1>")
});

module.exports = router;
