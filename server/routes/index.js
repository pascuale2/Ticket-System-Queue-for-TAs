var express = require('express');
var router = express.Router();
var db = require('./sql');

var courses_;
var connection;

/* GET home page. */
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

router.post('/professors', function(req, res, next){                    // For a professor search
  db.searchProfessor(connection, req.body.professor, function(result) {
    res.render('professors', {data: result});
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

router.post('/questions', function(req, res, next) {
    var largestid;
    db.getQuestionID(connection, function(result) {
      largestid = result;
      console.log("\n LARGEST ID IS: ",largestid,"\n");
      db.askQuestion(connection, req.body.question_ask, 100, largestid, function(result) {
        console.log("result is ",result);
      res.render('questions_asked');
    });
  });


});
router.get('/questions', function(req, res, next) {
  db.obtainQuestions(connection, function(result) {
    res.render('questions', {data: result});
  });
});

router.get('/courses', function(req, res, next) {
  // student_id is in /public/google.js
    db.obtainAllCourses(connection, function(result) {
        res.render('courses', {data: result});
    });
});

router.get('/courses', function(req, res, next) {
  res.render('courses');
});
router.post('/course_search', function(req, res, next) {
  db.searchCourses(connection, req.body.course, function(result){
    console.log("result is ",result);
    res.render('course_search', {data: result});
  });
});
router.get('/course_search', function(req, res, next) {
  res.render('course_search')
});
router.get('/question_success', function(req, res, next) {
  res.render('question_success');
});
router.get('/question_ask', function(req, res, next) {
  res.render('question_ask');
});
/*
router.post('/questions_search', function(req, res, next) {                    // For a question search
  console.log("result is: ",req.body.question);
  db.searchQuestions(connection, req.body.question, function(result) {
    res.render('questions_search', {data: result});
  });
});
*/
router.get('/questions_search', function(req, res, next) {
  res.render('questions_search');
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
module.exports = router;
