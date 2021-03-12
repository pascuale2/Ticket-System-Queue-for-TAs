var mysql = require('mysql');
function configDatabase(req, res) {

  var connection = mysql.createConnection({
    host: "mysql.mapledonut.ca",
    user: "mapledonutca1",
    password: "UQ8P2mdX",
    database: "mapledonut_ca"
  });
  connection.connect(function(err) {
    if(err){
      return console.log("error" + err.message);               // connection failed
    }else{
      console.log("connected to mapledonut_ca");                // connection success
      //let insertQuery = 'INSERT INTO ?? (??,??,??,??) VALUES (?,?,?,?)';
      //let query = mysql.format(insertQuery,["Student","student_id","email","biography",
    //  "discipline_id", 100, "test@gmail.com", "test", 101]);
    }
  });
  return connection;
}

function obtainAllCourses(connection, callback){
  let query = 'SELECT course_name FROM Course,Student,Takes WHERE Student.student_id=Takes.student_id AND Takes.course_id = Course.course_id AND Student.student_id = 101';

  connection.query(query, (err, result) => {
    if(err){                                               // query failed
      console.log(err);
    }else{
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

function obtainAllProfessors(connection, callback){
  let query = 'SELECT name FROM Teacher, Teaches, Course WHERE Teacher.teacher_id = Teaches.teacher_id AND Teaches.course_id = Course.course_id \
  AND Course.course_id IN (SELECT Course.course_id FROM Course, Takes, Student WHERE Course.course_id = Takes.course_id AND Takes.student_id = 100)';

  connection.query(query, (err, result) => {
    if(err){                                               // query failed
      console.log(err);
    }else{
      var teachers;                    // query success
      for (var i = 0; i <result.length; i ++){
            teachers += result[i].name;
      }
      teachers = teachers.slice(9);
      callback(teachers);
    }
  });
}


function obtainTeaches(connection, coursename, callback) {
  console.log(coursename);
  let query = 'SELECT name, available FROM Teacher, Course, Teaches WHERE Teacher.teacher_id = \
  Teaches.teacher_id AND Teaches.course_id = Course.course_id AND Course.course_name = ?';

  connection.query(query, coursename, (err, result) => {
    if (err) {
      console.log("CANNOT execute query", err);
    }else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

function obtainQuestions(connection, callback) {
  let query = 'SELECT question_string, question_status FROM Question, Student WHERE \
  Question.student_id = 100';
  connection.query(query, (err, result) => {
    if (err) {
      console.log("CANNOT execute query", err);
    }else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

function searchProfessor(connection, input, callback) {
  let replacement = `'%${input}%'`;
  let query = 'SELECT * FROM Teacher WHERE name like '+replacement;
  connection.query(query, (err, result) => {
    if (err) {
      console.log("CANNOT execute search", err);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}
/*
function searchQuestions(connection, input, callback) {
  let replacement = `'%${input}%'`;
  let query = 'SELECT * FROM Question WHERE question_string like '+replacement;
  connection.query(query, (err, result) => {
    if (err) {
      console.log("CANNOT execute search", err);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}


function searchCourses(connection, course, callback) {
  let replacement = `'%${input}%'`;
  let query = 'SELECT * FROM Course WHERE course_name like '+replacement;
  connection.query(query, (err, result) => {
    if (err) {
      console.log("CANNOT execute search", err);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}*/


module.exports = {configDatabase, obtainAllCourses, obtainAllProfessors, obtainTeaches,
obtainQuestions, searchProfessor};
