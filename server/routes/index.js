var express = require('express');
var router = express.Router();
var db = require('./sql');
var connection;

/**
 * GET home page.
 */ 
router.get('/', function(req, res, next) {
  connection = db.configDatabase(req, res);
  res.render('login');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/home', function(req, res, next) {
  res.render('home');
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
      res.render('questions',
        {"data": questionResults,
        "courses": courseResults});
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
    db.askQuestion(connection, req.body.question_ask, 100, req.body.text_area, req.body.label, 200, req.body.course_combobox, largestid, function(result) {
      db.obtainQuestions(connection, function(questionResults) {
        db.obtainAllCourses(connection, function(courseResults) {
          res.render('questions', 
          {"data": questionResults,
          "courses": courseResults});
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
  db.searchQuestions(connection, req.body.filter_combobox, req.body.question_search, function(searchQuestionResults) {
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
      res.render('professors', {data: result});
    });
});

router.get('/discussions', function(req, res, next) {
  res.render('discussions');
});

router.get('/chat', function(req, res, next) {
  res.render('chat');
});

router.get('/settings', function(req, res, next) {
  res.render('settings');
});

router.get('/settings_edit', function(req, res, next) {
  res.render('settings_edit');
});

module.exports = router;
