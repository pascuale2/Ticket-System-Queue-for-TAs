var mysql = require('mysql');

function configDatabase(req, res) {
  var connection = mysql.createConnection({
    host: "mysql.mapledonut.ca",
    user: "mapledonutca1",
    password: "UQ8P2mdX",
    database: "mapledonut_ca"
  });
  connection.connect(function(err) {
    if(err) {
      return console.log("error" + err.message);               // connection failed
    } else {
      console.log("connected to mapledonut_ca");                // connection success
      //let insertQuery = 'INSERT INTO ?? (??,??,??,??) VALUES (?,?,?,?)';
      //let query = mysql.format(insertQuery,["Student","student_id","email","biography",
    //  "discipline_id", 100, "test@gmail.com", "test", 101]);
    }
  });
  return connection;
}

/**
 * obtains all courses that the student took.
 * 
 * @param {*} connection 
 * @param {*} callback 
 */
function obtainAllCourses(connection, callback){
  let query = '\
   SELECT *\
   FROM Course,Student,Takes\
   WHERE Student.student_id=Takes.student_id AND Takes.course_id = Course.course_id AND Student.student_id = 101';

  connection.query(query, (err, result) => {
    if(err){                                               // query failed
      console.log(err);
    }else{
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

/**
 * obtains all the professors for the courses that student is enrolled in.
 * 
 * @param {*} connection 
 * @param {*} callback 
 */
function obtainAllProfessors(connection, callback){
  let query = '\
  SELECT name\
  FROM Teacher, Teaches, Course \
  WHERE Teacher.teacher_id = Teaches.teacher_id AND Teaches.course_id = Course.course_id \
  AND Course.course_id IN (SELECT Course.course_id FROM Course, Takes, Student \
  WHERE Course.course_id = Takes.course_id AND Takes.student_id = 100)';
  connection.query(query, (err, result) => {
    if(err) {                                               // query failed
      console.log(err);
    } else {
      var teachers;                    // query success
      for (var i = 0; i <result.length; i ++){
        teachers += result[i].name;
      }
      teachers = teachers.slice(9);
      teachers = JSON.stringify(teachers);
      callback(teachers);
    }
  });
}

/**
 * obtain professors that teach courses.
 * 
 * @param {*} connection 
 * @param {string} coursename 
 * @param {*} callback 
 */
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

/**
 * obtains questions from student.
 * 
 * @param {*} connection 
 * @param {*} callback 
 */
function obtainQuestions(connection, callback) {
  let query = '\
     SELECT DISTINCT * \
     FROM Question INNER JOIN Student \
     ON Question.student_id = Student.student_id \
     WHERE Question.student_id = 100';
  connection.query(query, (err, result) => {
    if (err) {
      console.log("CANNOT execute query", err);
    }else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

/**
 * obtain all questions.
 * 
 * @param {*} connection 
 * @param {*} callback 
 */
function obtainAllQuestions(connection, callback) {
  let query = 'SELECT * FROM Question';
  connection.query(query, (err, result) => {
    if (err) {
      console.log("CANNOT execute search", err);
    } else {
      result = JSON.parse(JSON.stringify(result));
      console.log("QUESTIONS: ",result);
      callback(result);
    }
  });
}

/**
 * searches professor from user input.
 * 
 * @param {*} connection 
 * @param {*} input 
 * @param {*} callback 
 */
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

/**
 * searches questions from user inputted filter and search query.
 * 
 * @param {*} connection 
 * @param {*} category 
 * @param {*} input 
 * @param {*} callback 
 */
function searchQuestions(connection, sort, category, input, callback) {
  // let filter = `'%${category}%'`;
  let replacement = `'%${input}%'`;
  let query = '\
  SELECT *\
  FROM Question INNER JOIN Course ON Question.course_id = Course.course_id\
  WHERE ' + category + ' like ' + replacement;

  console.log("TYPE: ",typeof sort);
  if (!(sort === "")) {
    query = query +'\
    ORDER BY ' + sort + ' DESC';
  }

  console.log("FILTER IS: ",category)
  console.log("INPUT IS: ",input)
  connection.query(query, (err, result) => {
    if (err) {
      console.log("CANNOT execute search", err);
    } else {
      result = JSON.parse(JSON.stringify(result));
      console.log(result);
      callback(result);
    }
  });
}

/**
 * searches courses from user inputted search query.
 * 
 * @param {*} connection 
 * @param {*} course 
 * @param {*} callback 
 */
function searchCourses(connection, course, callback) {
  let replacement = `'%${course}%'`;
  let query = 'SELECT * FROM Course WHERE course_name like '+replacement;
  connection.query(query, (err, result) => {
    if (err) {
      console.log("CANNOT execute search", err);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

/**
 * gets the highest question id from question table.
 * 
 * used in making new question id for new questions.
 * 
 * @param {*} connection 
 * @param {*} callback 
 */
function getQuestionID(connection, callback){
 let query = 'SELECT MAX(question_id) AS largestId FROM Question WHERE 1=1';
  connection.query(query, (err, result) => {
  if (err) {
  console.log("Cannot find max question_id");
  } else {
  result = JSON.parse(JSON.stringify(result[0])).largestId;
  callback(result);
  }
  });
}

// TODO: somehow incorporate the queue_id into the questions
/**
 * inserts a new question from user inputted fields
 * 
 * @param {*} connection 
 * @param {string} question_title: title of question
 * @param {string} stu_id:         student id 
 * @param {string} q_desc:         question description
 * @param {string} label:          label or tag of the question
 * @param {string} dis_id:         discipline id of question
 * @param {string} c_id:           course id of question
 * @param {string} qid:            question id of question
 * @param {*} callback 
 */
function askQuestion(connection, question_title, stu_id, q_desc, label, dis_id, c_id, qid, callback) {
  qid +=1;
  console.log('quid is ',qid);
  var status = 0;

  let query = '\
     INSERT INTO Question\
     (question_id, question_title, question_status, student_id, question_desc, label, discipline_id, course_id)\
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
     connection.query(query, [qid, question_title, status, stu_id, q_desc, label, dis_id, c_id],(err, result) => {
    if (err) {
      console.log("CANNOT insert into question", err);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

/**
 * obtains the session from inputted professor
 * 
 * @param {*} connection 
 * @param {String} teacher: teacher that we're trying to obtain session from
 * @param {*} callback 
 */
function obtainSession(connection, teacher, callback) {
  let query = 'SELECT * FROM Session WHERE teacher_id = ?';
  connection.query(query, teacher, (err, result) => {
    if(err) {
      console.log("cannot find session for ",teacher);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

/**
 * 
 * @param {*} connection 
 * @param {string} teach_id
 * @param {string} course_id 
 * @param {*} callback 
 */
function obtainAllTaught(connection, teach_id, course_id, callback) {
  console.log(typeof course_id);
  let query = 'SELECT * FROM Session \
  JOIN Course ON Session.course_id = Course.course_id\
  WHERE teacher_id = ? \
  AND Course.course_id IN '+course_id;
    connection.query(query, teach_id, (err, result) =>{
      if(err) {
        console.log("cannot find course for ",course_id, teach_id);
      } else {
        result = JSON.parse(JSON.stringify(result));
        callback(result);
      }
    });
}

/*
function getQueueID(connection){
 let query = 'SELECT MAX(queue_id) FROM Queue WHERE 1=1';
  connection.query(query, (err, result) => {
  if (err {
  console.log("Cannot find max queue_id");
  } else {
  return result;
});
}

function getDiscipline(connection, teach_id) {
  let query = 'SELECT discipline_id FROM discipline, Teacher WHERE Teacher.teacher_id = teach_id';
  connection.query(query, (err, result) => {
  if (err) {
    console.log("CANNOT insert into question", err);
  } else {
    result = JSON.parse(JSON.stringify(result));
    return result;
  }
  });
}

function obtainQuestionID(connection, question_str) {
  let query = 'SELECT question_id FROM Question WHERE \
  question_string = question_str';
  connection.query(query, (err, result) => {
    if (err) {
      console.log("CANNOT find question_id", err);
    }else {
      result = JSON.parse(JSON.stringify(result));
      return result;
    }
  });
}

function obtainSessionID(connection, teach_id) {
let query = 'SELECT session_id FROM Session, Teacher WHERE \
Teacher.teacher_id = teach_id AND Teacher.teacher_id = Session.teacher_id';
connection.query(query, (err, result) => {
  if (err) {
    console.log("CANNOT find question_id", err);
  }else {
    result = JSON.parse(JSON.stringify(result));
    return result;
  }
});
}


function insertIntoQueue(connection, stu_id, teach_id, question_str, callback) {
  que_id = getQueueID(connection);
  que_id +=1;

  discipline = getDiscipline(connection, teach_id);
  question = obtainQuestionID(connection, question_str);
  session = obtainSessionID(connection, teach_id);

  let query = 'INSERT INTO QUEUE(queue_id,	answer_ids,	question_ids,	student_ids,
  	teacher_id,	discipline_id,	question_id,	session_id) VALUES(que_id, 'Not answered',
  stu_id, teach_id, discipline, question, session)';
  connection.query(query, (err, result) => {
    if (err) {
      console.log("CANNOT insert into queue", err);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

*/

/**
 * exports the modules for the other .js files to use
 */
module.exports = {configDatabase, obtainAllCourses, obtainAllProfessors, obtainTeaches,
obtainQuestions, obtainAllQuestions, searchProfessor, searchCourses, searchQuestions, getQuestionID, askQuestion,
obtainSession, obtainAllTaught};
