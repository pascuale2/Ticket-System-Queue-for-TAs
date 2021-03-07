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
    console.log("query returned: ",result);
    res.render('queues', {data: result});
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
router.get('/questions', function(req, res, next) {
  res.render('questions');
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
module.exports = router;
