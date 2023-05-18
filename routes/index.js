const express = require("express");
const router = express.Router();
const path= require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  var filePath = path.join(__dirname,'../', 'public/events.html',);
  return res.sendFile(filePath);

  // res.render('index', { title: 'Express' });
  // return res.send("<h1>hi there </h1>");     
});

router.get('/send-test-event',(req,res,next)=>{
  try{
    req.io.emit('user-id-1','test-event',{  "customer": "8823","conversation": "fc62","body": "hi hi","_id": "512","createdAt": "2023-05-17T22:23:58.225Z"});
    
    return res.sendStatus(200);
  }catch(r) {return res.json(e.message)}
})
module.exports = router;
