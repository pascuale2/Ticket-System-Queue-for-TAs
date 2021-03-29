var express = require('express');
var router = express.Router();
var db = require('./sql');
var request = require("request");
var zoom = require("./zoom.js");
const cors = require("cors");
router.use(cors());
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});
router.get('/home', function(req, res, next) {
  res.render('home');
});
router.get('/discussions', function(req, res, next) {
  res.render('discussions');
});
router.get('/professors', function(req, res, next) {
    var connection = db.configDatabase(req, res);
    db.obtainAllProfessors(connection, function(result) {
      res.render('professors', {data: JSON.stringify(result)});
    });
});
router.get('/settings', function(req, res, next) {
  res.render('settings');
});
router.get('/questions', function(req, res, next) {
  res.render('questions');
});
router.get('/courses', function(req, res, next) {
  // student_id is in /public/google.js
    var connection = db.configDatabase(req, res);
    db.obtainAllCourses(connection, function(result) {
        res.render('courses', {data: JSON.stringify(result)});
    });
});
router.get('/courses', function(req, res, next) {
  res.render('courses');
});
router.get('/question_success', function(req, res, next) {
  res.render('question_success');
});
router.get('/question_ask', function(req, res, next) {
  res.render('question_ask');
});
router.get('/settings_edit', function(req, res, next) {
  res.render('settings_edit');
});
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/chat', function(req, res, next) {
  res.render('chat');
});
router.get('/home/:userId', function (req, res) {
  // Access userId via: req.params.userId
  res.render('home');
})
router.get('/token/code', function (req, res) {
  var options = {
    method: 'POST',
    url: 'https://zoom.us/oauth/token',
    qs: {
    grant_type: 'authorization_code',
    //The code below is a sample authorization code. Replace it with your actual authorization code while making requests.
    code: req.query.code,
      //The uri below is a sample redirect_uri. Replace it with your actual redirect_uri while making requests.
    redirect_uri: 'https://localhost:3000/token/code'
    },
    headers: {
      /**The credential below is a sample base64 encoded credential. Replace it with "Authorization: 'Basic ' + Buffer.from(your_app_client_id + ':' + your_app_client_secret).toString('base64')"
      **/
       Authorization: 'Basic ' + Buffer.from('uqERGEzQThSiyeVrlQlMvQ' + ':' + 'm1WXMKlNAZs8SZ1D4MK3G28nCUBcdKIZ').toString('base64')
    }
  };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      var authtokn = JSON.parse(body).access_token;
      req.app.locals.zoomtokn=body;
      req.app.locals.authtokn=authtokn;
      zoom.getchannels(authtokn,res,req);
    });   
})
router.get('/token', function (req, res) {
  // Access userId via: req.params.userId
  res.redirect('https://zoom.us/oauth/authorize?response_type=code&client_id=uqERGEzQThSiyeVrlQlMvQ&redirect_uri=https://localhost:3000/token/code');
})
router.post('/chat/redirect', function (req, res) {
  var message = req.body.message;
  var channel = req.body.to_channel;
  //console.log(req.body.message,req.body.to_channel);
  //console.log(req.body);
  var options = {
    method: 'POST',
    url: 'https://api.zoom.us/v2/chat/users/me/messages',
    headers: {'content-type': 'application/json', authorization: 'Bearer'+req.app.locals.authtokn},
    body: {
      message: message,
      to_channel: channel,
    },
    json: true
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    console.log(body);
  });
  res.end("yes");
})
router.post('/home/idtoken', function (req, res) {
  var idtoken = req.body.token;
  console.log(idtoken);
  res.end("yes");
})
router.get('/profpage1', function(req, res, next) {
  res.render('name of jade file here');
});
router.get('/profpage2', function(req, res, next) {
  res.render('name of jade file here');
});
router.get('/profpage3', function(req, res, next) {
  res.render('name of jade file here');
});
router.get('/profpage4', function(req, res, next) {
  res.render('name of jade file here');
});
  
module.exports = router;
