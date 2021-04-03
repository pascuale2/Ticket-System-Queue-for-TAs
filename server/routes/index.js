var express = require('express');
var router = express.Router();
var db = require('./sql');
var queue = require('./queue');
var answers = require('./prof_answer');

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

//TODO: FIX THIS SHIT
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
          c += ","
        }
        var c = c.replace(/.$/,")");
        if(c.length<2){
          res.render('questions', {
            "courses": courseResults
          });
        }
        else{
          db.obtainAllQuestionInfo(connection, c, function(allresults) {
            db.obtainAllCourses(connection, function(courseResults) {
              res.render('questions', {
                "data": allresults,
                "courses": courseResults});
            });
          });
        } 
      });
  });
});

/**
 * Post request for "Ask a Question" page (FOR PROFESSORS)
 *
 * db.getQuestionID   -> gets the largest question id
 * db.askQuestion     -> inserts the question into the database
 * db.obtainQuestions -> obtains the questions for the homepage to display
 * db.obtainAllCourses-> the courses the student is enrolled in which is used to
 *                       populate the comboBox.
 */
router.post('/questions/professor', function(req, res, next) {
  //TODO: CHANGE THIS PLSSSSSSSS
  var temp_student_id = 100;
  db.getQuestionID(connection, function(largestid) {
    // TODO: Replace with Student ID and insert DISCIPLINE
    var courseid = req.body.course_combobox;
    //var quest_id = req.body.question_ask;
    db.askQuestion(connection, req.body.question_ask, temp_student_id, req.body.text_area, req.body.label, 200, req.body.course_combobox, largestid, function(question_id) {
      db.obtainQuestions(connection, function(questionResults) {
        db.obtainAllCourses(connection, function(courseResults) {
          console.log('question id is ',question_id);
          queue.generateQueue(connection, courseid, question_id, function(queue_id) {
            var temp = "(";
            temp += question_id;
            temp += ")";
            db.findCurrentPosition(connection, temp, function(position){
              db.obtainAllQuestionInfoByStudentID(connection, temp_student_id, function(allResults) {
                res.render('questions',
                {"data": allResults,
                "courses": courseResults,
                "queue": position});
              });
            });
          });
        });
      });
    });
  });
});


/**
 * Post request for "Ask a Question" page (FOR ADVISORS)
 *
 * db.getQuestionID   -> gets the largest question id
 * db.askQuestion     -> inserts the question into the database
 * db.obtainQuestions -> obtains the questions for the homepage to display
 * db.obtainAllCourses-> the courses the student is enrolled in which is used to
 *                       populate the comboBox.
 */
 router.post('/questions/advisor', function(req, res, next) {
  //TODO: CHANGE THIS PLSSSSSSSS
  var temp_student_id = 100;
  var courseid = (1800 + parseInt(req.body.dept_combobox)).toString();

  db.getQuestionID(connection, function(largestid) {
    db.askQuestion(connection, req.body.question_ask, temp_student_id, req.body.text_area, req.body.label, req.body.dept_combobox, courseid, largestid, function(question_id) {
      db.obtainQuestions(connection, function(questionResults) {
        db.obtainAllCourses(connection, function(courseResults) {
          console.log('question id is ',question_id);
          queue.generateQueue(connection, courseid, question_id, function(queue_id) {
            var temp = "(";
            temp += question_id;
            temp += ")";
            db.findCurrentPosition(connection, temp, function(position){
              db.obtainAllQuestionInfoByStudentID(connection, temp_student_id, function(allResults) {
                res.render('questions',
                {"data": allResults,
                "courses": courseResults,
                "queue": position});
              });
            });
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
router.post('/questions_search', function(req, res, next) {                    // For question search
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

/**
 * Get request for "Asked Questions" page
 */
router.get('/questions_asked', function(req, res, next) {
  var temp_student_id = 100;
  db.obtainAllQuestionInfoByStudentID(connection, temp_student_id, function(allResults) {
    db.obtainAnsweredQuestionsByStudentID(connection, temp_student_id, function(answerResults) {
      res.render('questions_asked', {
        "data": allResults,
        "answers": answerResults});
    });
  });
});

/**
 *
 */
router.post('/professors', function(req, res, next){                    // For a professor search
  db.searchProfessor(connection, req.body.professor, req.body.sort_combobox, req.body. order_combobox, function(result) {
    res.render('professors', {data: result});
  });
});

/**
 *
 */
router.get('/professors', function(req, res, next) {
  res.render('professors');
});

router.get('/discussions', function(req, res, next) {
  res.render('discussions');
});

router.get('/chat', function(req, res, next) {
  res.render('chat');
});

router.get('/settings_edit', function(req, res, next) {
  res.render('settings_edit');
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
})

/**
 * 
 */
router.post('/home/idtoken', function (req, res) {
  var idtoken = req.body.token;
  console.log(idtoken);
  console.log(idtoken.toString().length);
  res.end("yes");
})

/**********************************************
 *            PROFESSOR ROUTING
 **********************************************/
router.get('/prof_home', function(req, res, next) {
  res.render('prof_home');
});

/**
 * get request for professor course page
 *
 * db.obtainQuestionFromACourse -> obtains all the questions from the inputted course
 * db.obtainCourseInfo -> obtains the course information we are trying to answer questions from
 */
 router.get('/prof_courses/:courses', function(req, res, next) {
  var course_name = req.params.courses;
  db.obtainQuestionFromACourse(connection, req.body.check_question, "", function(questionResults) {
    res.render('prof_questions-answer', {
      "questions": questionResults,
      "courseID": course_name});
  });
});

/**
 * Get request for professor course page
 *
 * db.obtainAddableCourses -> obtains all the courses from the discipline the prof teaches_id
 * db.obtainTeachinCourses -> obtains all the courses that the professor currently teaches
 */
router.get('/prof_courses', function(req, res, next) {
  var temp_prof_id = 4000011;
  db.obtainAddableCourses(connection, function(courseResults) {
    db.obtainQuestionCountFromCoursesTaught(connection, temp_prof_id, function(questionCountResults) {
      res.render('prof_courses', {
        "data": courseResults,
        "count": questionCountResults});
    });
  });
});

/**
 * get request for professor overview page -> professor question overview page
 *
 * db.obtainQuestionFromACourse -> obtains all the questions from the inputted course
 */
router.get('/prof_questions/:courses', function(req, res, next) {
  var course_name = req.params.courses;
  db.obtainQuestionFromACourse(connection, course_name, "", function(questionResults) {
    res.render('prof_questions-answer', {
      "questions": questionResults,
      "courseID": course_name});
  });
});

/**
 * Get request for professor questions overview page
 *
 * db.obtainAddableCourses -> obtains all the courses from the discipline the prof teaches_id
 * db.obtainTeachinCourses -> obtains all the courses that the professor currently teaches
 */
router.get('/prof_questions', function(req, res, next) {
  var temp_prof_id = 4000011;
  db.obtainQuestionCountFromCoursesTaught(connection, temp_prof_id, function(questionCountResults) {
    console.log("DATA: ", questionCountResults);
    res.render('prof_questions', {data: questionCountResults});
  });
});

/**
 * Get request for professor answer a question page
 *
 * db.obtainQuestionFromACourse -> obtains the question information from the user inputted course
 */
 router.get('/prof_questions/:courses/:question_id', function(req, res, next) {
   var course_name = req.params.courses;
   var question_id = req.params.question_id;
   db.obtainQuestionFromACourse(connection, course_name, question_id, function(questionResult) {
     res.render('prof_answer-question', {data: questionResult});
   });
 });

/**
* Post request for professor answer a question page
*
* db.obtainQuestionFromACourse -> obtains the question information from the user inputted course
*/
router.post('/prof_questions/:courses/:question_id', function(req, res, next) {
  var course_name = req.params.courses;
  var question_id = req.params.question_id;
  console.log(req.body);
  db.obtainQuestionFromACourse(connection, course_name, question_id, function(questionResult) {
    console.log(question_id, questionResult[0].course_id, req.body.text_area);
    answers.insertAnswer(connection, req.body.text_area, "DATE Not applicable", question_id, questionResult[0], function(answerResult) {
      res.render('prof_home');
    });
  });
});

module.exports = router;
