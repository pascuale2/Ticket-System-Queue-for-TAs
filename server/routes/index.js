var express = require('express');
var router = express.Router();
var db = require('./sql');
var queue = require('./queue');

var request = require("request");
var zoom = require("./zoom.js");
const cors = require("cors");
router.use(cors());
/* GET home page. */

var connection;
router.get('/', function(req, res, next) {
  connection = db.configDatabase(req, res);
  res.render('login');
});


router.get('/home', function(req, res, next) {
  res.render('home');
});
router.get('/discussions', function(req, res, next) {
  res.render('discussions');
});

router.get('/professors/:coursename', function(req, res, next){
  var id = req.params.coursename;
  db.obtainTeaches(connection, id, function(result) {
    res.render('queues', {data: result});
  });
});

router.get('/schedule/:profname', function(req, res, next){
  var id = req.params.profname;
  db.searchProfessor(connection, id, function(result) {
    var teaches_id = result[0].teacher_id;
    db.obtainSession(connection, teaches_id, function(result) {
      var c = "(";
      for (var i=0; i<result.length; i++){
          c += (result[i].course_id);
          c+=","
        }
        var c = c.replace(/.$/,")");

        db.obtainAllTaught(connection, teaches_id, c, function(courses) {
        res.render('schedule', {"data": result, "teacher":id, "course": courses});
      });
    });
  });
});

router.get('/professors/schedule/:profname', function(req, res, next){
  var id = req.params.profname;
  db.searchProfessor(connection, id, function(result) {
    var teaches_id = result[0].teacher_id;
    db.obtainSession(connection, teaches_id, function(result) {
      var c = "(";
      for (var i=0; i<result.length; i++){
          c += (result[i].course_id);
          c+=","
        }
        var c = c.replace(/.$/,")");

        db.obtainAllTaught(connection, teaches_id, c, function(courses) {
        res.render('schedule', {"data": result, "teacher":id, "course": courses});
      });
    });
  });
});

router.get('/professors', function(req, res, next) {
    db.obtainAllProfessors(connection, function(result) {
      res.render('professors', {data: JSON.stringify(result)});
    });
});
router.get('/settings', function(req, res, next) {
  res.render('settings');
});

router.get('/courses', function(req, res, next) {
  // student_id is in /public/google.js
    db.obtainAllCourses(connection, function(result) {
      console.log("courses are",result);
        res.render('courses', {data: result});
    });
});
router.get('/course_search', function(req, res, next) {
  res.render('course_search');
});
router.post('/course_search', function(req, res, next) {
  db.searchCourses(connection, req.body.course, function(result){
    console.log("result is ",result);
    res.render('course_search', {data: result});
  });
});

/**
 * Get request for "Ask a Question" page.
 *
 * db.obtainQuestions -> obtains the questions for the homepage to display
 * db.obtainAllCourses-> the courses the student is enrolled in which is used to
 *                       populate the comboBox.
 */
 router.get('/questions', function(req, res, next) {
  db.obtainQuestions(connection, function(questionResults) {
    db.obtainAllCourses(connection, function(courseResults) {
      var c = "(";
      for (var i=0; i<questionResults.length; i++){
          c += (questionResults[i].question_id);
          c+=","
        }
        var c = c.replace(/.$/,")");
        if(c.length<2){
          res.render('questions', {
            "courses": courseResults
          });
        }
        else{
          db.obtainAllQuestionInfo(connection, c, function(allresults) {
            console.log(allresults);
            res.render('questions2', {"data": allresults});
      //db.obtainCourseByQuestionId(connection, c, function(coursename) {
        //  db.findCurrentPosition(connection, c, function(position){
          //res.render('questions',
        //    {"data": questionResults,
        //    "courses": courseResults,
        //    "queue": position,
        //    "coursenames": coursename});
        //  });
    //  });
          });
        }
            });
  });
});

/**
 * Post request for "Ask a Question" page
 *
 * db.getQuestionID   -> gets the largest question id
 * db.askQuestion     -> inserts the question into the database
 * db.obtainQuestions -> obtains the questions for the homepage to display
 * db.obtainAllCourses-> the courses the student is enrolled in which is used to
 *                       populate the comboBox.
 */
router.post('/questions', function(req, res, next) {
  db.getQuestionID(connection, function(largestid) {
    // TODO: Replace with Student ID and insert DISCIPLINE
    var courseid = req.body.course_combobox;
    //var quest_id = req.body.question_ask;
    db.askQuestion(connection, req.body.question_ask, 100, req.body.text_area, req.body.label, 200, req.body.course_combobox, largestid, function(question_id) {
      db.obtainQuestions(connection, function(questionResults) {
        db.obtainAllCourses(connection, function(courseResults) {

          //db.obtainCourseByQuestionId(connection, temp, function(coursename) {
          // TODO: queue stuff
          console.log('question id is ',question_id);
          //var queue_id =
          queue.generateQueue(connection, courseid, question_id, function(queue_id) {
            var temp = "(";
            temp += question_id;
            temp += ")";
            db.findCurrentPosition(connection, temp, function(position){
            console.log('Success: ',queue_id, "position: ",position);
            res.render('questions',
            {"data": questionResults,
            "courses": courseResults,
            "queue": position});
            //"coursenames": coursename});
              });
          //});
          });
        });
      });
    });
  });
});

/**
 * Post request for "Search a Question" page
 *
 * db.searchQuestions -> obtains the questions for the page to display
 */
router.post('/questions_search', function(req, res, next) {                    // For a question search
  db.searchQuestions(connection,req.body.sort_combobox, req.body.filter_combobox, req.body.question_search, function(searchQuestionResults) {
    res.render('questions_search', {data: searchQuestionResults});
  });
});

/**
 * Get request for "Search a Question" page
 */
 router.get('/questions_search', function(req, res, next) {
  res.render('questions_search');
});

router.get('/question_success', function(req, res, next) {
  res.render('question_success');
});

router.get('/question_ask', function(req, res, next) {
  res.render('question_ask');
});



router.post('/professors', function(req, res, next){                    // For a professor search
  db.searchProfessor(connection, req.body.professor, function(result) {
    res.render('professors', {data: result});
  });
});

router.get('/professors', function(req, res, next) {
    db.obtainAllProfessors(connection, function(result) {
      res.render('professors', {data: result});
    });
});

router.get('/discussions', function(req, res, next) {
  res.render('discussions');
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
  console.log(req.params);
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
});
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



router.get('/settings_edit', function(req, res, next) {
  res.render('settings_edit');
});


module.exports = router;
