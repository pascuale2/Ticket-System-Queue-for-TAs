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

var student = {
  'email': 'null', 'id': 0, 'name': 'null',
};

var connection;
router.get('/', function(req, res, next) {
  connection = db.configDatabase(req, res);
  res.render('login');
});

router.post('/login', function(req, res, next) {
  console.log(req.body.email_input)
  db.matchEmailInfo(connection, req.body.email_input, function(teacherID) {
    console.log("TEACHER ID RESULTS: ", teacherID);
  });
});

router.get('/home', function(req, res, next) {
  console.log({data: student});
  db.obtainAllCourses(connection, student.id, function(courseResults){
    console.log(courseResults);
    res.render('home', {
      "data": student,
      "courses": courseResults
    });
  });
});

router.get('/prof_login', function(req, res, next) {
  connection = db.configDatabase(req, res);
  res.render('prof_login');
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

/*
 * Displays a professors schedule with each label
 */
router.get('/schedule/:profname', function(req, res, next){
  var id = req.params.profname;
  db.searchProfessorByName(connection, id, function(result) {
    var teaches_id = result[0].teacher_id;
    console.log(teaches_id);
    db.obtainSchedule(connection, teaches_id, function(result) {
      var c = "(";
      for (var i=0; i<result.length; i++){
          if(result[i].course_id != null){
          c += (result[i].course_id);
          c+=","
        }
        }
        var c = c.replace(/.$/,")");

      db.obtainAllTaught(connection, teaches_id, c, function(courses) {
        db.getQuestionLabel(connection, teaches_id, function(labels) {
          console.log(labels);
          res.render('schedule', {"data": labels, "course": courses, "teacher": id});
        });
      });
    });
  });
});

/*
 * Displays the courses by each label from /schedule
 */
router.get('/schedule/:profname/:label/view_answers', function(req, res, next) {
  var label = req.params.label;
  var id = req.params.profname;
  db.searchProfessorByName(connection, id, function(result) {
    var teaches_id = result[0].teacher_id;
    db.getQuestionInfo(connection, label, teaches_id, function(result) {
      console.log("sorted labels are : ",result);
      res.render('question_overview', {"data": result, "labeltitle": label, "teacher":id});
    });
  });
});

/*
 * GET request for upvoting an answered question from a schedule
 */
router.get('/schedule/:profname/:label/view_answers/:question_id', function(req, res, next) {
  console.log("upvoted an answered question");
  console.log(req.params);
  db.upvoteQuestion(connection, req.params.question_id, function(result) {
    res.redirect('/schedule/'+req.params.profname+'/'+req.params.label+'/view_answers');
  });
});


/*
 * Gets the current profs schedule
*/
router.get('/schedule/:profname/current_prof_schedule', function(req, res, next) {
  var id = req.params.profname;
  console.log(id);
  db.searchProfessorByName(connection, id, function(result) {
    var teaches_id = result[0].teacher_id;
    var temp_prof_id = 4000011;
    db.obtainScheduleAndSession(connection, temp_prof_id, function(sched) {
        console.log("sched is: ", sched);
        res.render('view_prof_schedule', {"schedule": sched, "teacher": id});
    });
  });
});

router.get('/settings', function(req, res, next) {
  db.getStudentInfo(connection, student.id, function(result) {
    res.render('settings', {"data": result});
  });
});

router.get('/courses', function(req, res, next) {
  // student_id is in /public/google.js
  console.log(typeof student.id, student.id);
    db.obtainAllCourses(connection, student.id, function(result) {
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
  db.obtainQuestions(connection, student.id, function(questionResults) {
    db.obtainAllCourses(connection, student.id, function(courseResults) {
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
            db.obtainAllCourses(connection, student.id, function(courseResults) {
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
  //TODO: CHANGE DISCIPLINE ID!!!!!!!!!!!
  db.getQuestionID(connection, function(largestid) {
    var courseid = req.body.course_combobox;
    //var quest_id = req.body.question_ask;
    db.askQuestion(connection, req.body.question_ask, student.id, req.body.text_area, req.body.label, 200, req.body.course_combobox, largestid, function(question_id) {
      db.obtainQuestions(connection, student.id, function(questionResults) {
        db.obtainAllCourses(connection, student.id, function(courseResults) {
          console.log('question id is ',question_id);
          queue.generateQueue(connection, courseid, question_id, student.id, function(queue_id) {
            var temp = "(";
            temp += question_id;
            temp += ")";
            db.findCurrentPosition(connection, temp, function(position){
              db.obtainAllQuestionInfoByStudentID(connection, student.id, function(allResults) {
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
  var courseid = (1800 + parseInt(req.body.dept_combobox)).toString();

  db.getQuestionID(connection, function(largestid) {
    db.askQuestion(connection, req.body.question_ask, student.id, req.body.text_area, req.body.label, req.body.dept_combobox, courseid, largestid, function(question_id) {
      db.obtainQuestions(connection, function(questionResults) {
        db.obtainAllCourses(connection, function(courseResults) {
          console.log('question id is ',question_id);
          queue.generateQueue(connection, courseid, question_id, student.id, function(queue_id) {
            var temp = "(";
            temp += question_id;
            temp += ")";
            db.findCurrentPosition(connection, temp, function(position){
              db.obtainAllQuestionInfoByStudentID(connection, student.id, function(allResults) {
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

/*
 * GET Request for upvoting a question from /search_questions
*/
router.get('/questions_search/:question_id', function(req, res, next) {
  console.log("Starred the question: ", req.params);
  db.upvoteQuestion(connection, req.params.question_id, function(result) {
    res.render('questions_search');
  });
});

/**
 * GET Request for viewing an answered question
*/
router.get('/questions_search/answer/:question_id', function(req, res, next) {
  console.log(req.params.question_id);
  db.obtainAnsweredQuestionByQID(connection, req.params.question_id, function(answerResults) {
    console.log(answerResults);
    res.render('questions_answered', {"data": answerResults});
  });
});


/**
 * Get request for "Asked Questions" page
 */
router.get('/questions_asked', function(req, res, next) {
  db.obtainAllQuestionInfoByStudentID(connection, student.id, function(allResults) {
    db.obtainAnsweredQuestionsByStudentID(connection, student.id, function(answerResults) {
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
  //console.log("test");
  //console.log(req.app.locals.authtokn);
  res.render('chat');
});

router.get('/settings_edit', function(req, res, next) {
  db.getStudentInfo(connection, student.id, function(result) {
    console.log(result);
    res.render('settings_edit', {"data": result});
  });
});

router.post('/settings_edit', function(req, res, next) {
  db.updateStudentInfo(connection, req.body.stu_name, req.body.stu_email,
    req.body.discipline_name, req.body.student_bio, student.id, function(result) {
    db.getStudentInfo(connection, student.id, function(result) {
      res.render('settings', {"data": result});
    });
  });
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
    if(res.app.locals.prevurl=="chat"){
      res.redirect("https://localhost:3000/chat");
    }
    if(res.app.locals.prevurl=="schedule"){
      res.redirect("https://localhost:3000/prof_schedule/add_schedule");
    }
  });
})

router.get('/token/:url', function (req, res) {
  res.app.locals.prevurl=req.params.url;
  console.log(res.app.locals.prevurl);
  // Access userId via: req.params.userId
  res.redirect('https://zoom.us/oauth/authorize?response_type=code&client_id=uqERGEzQThSiyeVrlQlMvQ&redirect_uri=https://localhost:3000/token/code');
})

router.post('/chat/redirect', function (req, res) {
  var channel = req.body.to_channel;
  console.log(req.body.to_channel);
  //console.log(req.body);
  var options = {
    method: 'POST',
    url: 'https://api.zoom.us/v2/chat/users/me/channels',
    headers: {'content-type': 'application/json', authorization: 'Bearer'+req.app.locals.authtokn},
    body: {name: channel, type: 1, members: [{email: 'gamerghost23@hotmail.com'}]},
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
  console.log(req.body);
  student.id = parseInt(idtoken);
  student.email = req.body.email;
  student.name = req.body.name;

  // get mymacewan.ca or macewan.ca
  var fields = student.email.split(/@/)[1];
  var profemail = 'macewan.ca';
  if(profemail.localeCompare(fields)==0){
    console.log("logged in as a professor");
  } else {

  // After logging in, insert the student into the database
  db.insertStudent(connection, student.id, student.email, student.name, function(result) {
    console.log("Success, added to the database", student.id);
  });
}
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
 * GET request for professor course page
 *
 * db.obtainAddableCourses -> obtains all the courses from the discipline the prof teaches_id
 * db.obtainQuestionCountAndScheduleCountFromCoursesTaught -> obtains all the question count and the schedule count from 
 *                                                            the courses the prof teaches
 */
router.get('/prof_courses', function(req, res, next) {
  var temp_prof_id = 4000011;
  db.obtainAddableCourses(connection, temp_prof_id, function(courseResults) {
    db.obtainQuestionCountAndScheduleCountFromCoursesTaught(connection, temp_prof_id, function(questionCountResults) {
      res.render('prof_courses', {
        "data": courseResults,
        "count": questionCountResults});
    });
  });
});

/**
 * POST request for professor course page for adding a course
 *
 * db.insertCourse -> inserts the course selected to professors course list
 * db.obtainAddableCourses -> obtains all the courses from the discipline the prof teaches_id
 * db.obtainQuestionCountAndScheduleCountFromCoursesTaught -> obtains all the question count and the schedule count from 
 *                                                            the courses the prof teaches
 */
router.post('/prof_courses/add_course', function(req, res, next) {
  var temp_prof_id = 4000011;
  db.insertCourse(connection, temp_prof_id, req.body.course_combobox, function(result){
    db.obtainAddableCourses(connection, temp_prof_id, function(courseResults) {
      db.obtainQuestionCountAndScheduleCountFromCoursesTaught(connection, temp_prof_id, function(questionCountResults) {
        res.render('prof_courses', {
          "data": courseResults,
          "count": questionCountResults});
      });
    });
  });
});

/**
 * POST request for professor course page for deleting a course
 *
 * db.insertCourse -> inserts the course selected to professors course list
 * db.obtainAddableCourses -> obtains all the courses from the discipline the prof teaches_id
 * db.obtainQuestionCountAndScheduleCountFromCoursesTaught -> obtains all the question count and the schedule count from 
 *                                                            the courses the prof teaches
 */
 router.post('/prof_courses/delete_course', function(req, res, next) {
  var temp_prof_id = 4000011;
  db.deleteCourse(connection, temp_prof_id, req.body.delete_course_button, function(result){
    db.obtainAddableCourses(connection, temp_prof_id, function(courseResults) {
      db.obtainQuestionCountAndScheduleCountFromCoursesTaught(connection, temp_prof_id, function(questionCountResults) {
        res.render('prof_courses', {
          "data": courseResults,
          "count": questionCountResults});
      });
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
  db.obtainQuestionFromACourse(connection, course_name, "", "", function(questionResults) {
    res.render('prof_questions-answer', {
      "questions": questionResults,
      "courseID": course_name});
  });
});

router.post('/prof_questions/:courses', function(req, res, next) {
  var course_name = req.params.courses;
  console.log(req.body);
  db.obtainQuestionFromACourse(connection, course_name, "", req.body.sort_combobox, function(questionResults) {
    res.render('prof_questions-answer', {
      "questions": questionResults,
       "courseID":course_name});
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
  var temp_prof_id_jaime = 4000001;
  db.obtainQuestionCountFromCoursesTaught(connection, temp_prof_id, function(questionCountResults) {
    db.findTeacherName(connection, temp_prof_id_jaime, function(profname) {
      console.log("DATA: ", questionCountResults);
      res.render('prof_questions', {data: questionCountResults, "prof_name": profname[0].name});
    });
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
   db.obtainQuestionFromACourse(connection, course_name, question_id, "", function(questionResult) {
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
  db.obtainQuestionFromACourse(connection, course_name, question_id, "", function(questionResult) {
    console.log(question_id, questionResult[0].course_id, req.body.text_area);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    answers.insertAnswer(connection, req.body.text_area, today, question_id, questionResult[0], function(answerResult) {
      res.render('prof_home');
    });
  });
});

/**********************************************
 *            SCHEDULE ROUTING                *
 **********************************************/

router.get('/prof_schedule', function(req, res, next) {                 // Edit schedule, view schedule
  var temp_prof_id = 4000011;
    db.obtainProfessorSchedule(connection, temp_prof_id, "", function(scheduleResults) {
      res.render('prof_schedule', {schedules: scheduleResults});
    });
});

router.post('/prof_schedule/delete_schedule', function(req, res, next) {                 // Edit schedule, view schedule
  var temp_prof_id = 4000011;
  db.deleteSchedule(connection, temp_prof_id, req.body.delete_schedule_button, function(result) {
    db.obtainProfessorSchedule(connection, temp_prof_id, "", function(scheduleResults) {
      res.render('prof_schedule', {schedules: scheduleResults});
    });
  });
});

router.get('/prof_schedule/add_schedule', function(req, res, next) {    // Add new schedule
  console.log('made it to prof add schedule');
  var temp_prof_id = 4000011;
  db.obtainTeachingCourses(connection, temp_prof_id, function(courseResults) {
    res.render('prof_add-schedule', {courses: courseResults});
  });
});

router.get('/prof_schedule/:coursename/edit_schedule', function(req, res, next) {                 // Edit schedule, view schedule
  var course_id = req.params.coursename;
  var temp_prof_id = 4000011;
  db.obtainProfessorSchedule(connection, temp_prof_id, course_id, function(scheduleResults) {
    res.render('prof_edit-schedule', {schedules: scheduleResults});
  });
});

// POST request to edit an existing schedule
router.post('/prof_schedule/:coursename/edit_schedule', function(req, res, next) {
  var course_id = req.params.coursename;
  var temp_prof_id = 4000011;
  db.editSchedule(connection, req.body.day_combobox, req.body.start_time_combobox,
    req.body.end_time_combobox, temp_prof_id, course_id, function(result) {
    console.log("Successfully edited schedule: ", result);
    db.obtainProfessorSchedule(connection, temp_prof_id, "", function(scheduleResults) {
      res.render('prof_schedule', {schedules: scheduleResults});
    });
  });
});

// POST request to create a new schedule
router.post('/prof_schedule/add_schedule', function(req, res, next) {
  console.log('creating new schedule', req.body);
  var temp_prof_id = 4000011;
  db.createSchedule(connection, req.body.course_combobox, temp_prof_id, req.body.day_combobox,
    req.body.start_time_combobox, req.body.end_time_combobox, "", function(result) {
    res.render('prof_add-schedule');
  },req.app.locals.authtokn);
});

module.exports = router;
