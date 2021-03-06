var express = require('express');
var router = express.Router();
var db = require('./sql');

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
module.exports = router;
