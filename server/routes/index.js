var express = require('express');
var router = express.Router();

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
  res.render('professors');
});
router.get('/settings', function(req, res, next) {
  res.render('settings');
});
router.get('/questions', function(req, res, next) {
  res.render('questions');
});
router.get('/courses', function(req, res, next) {
  res.render('courses');
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
