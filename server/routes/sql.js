var mysql = require('mysql');

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
function configDatabase(req, res) {
  var connection = mysql.createConnection({
    host: "mysql.mapledonut.ca",
    user: "mapledonutca1",
    password: "UQ8P2mdX",
    database: "mapledonut_ca",
    queueLimit : 0, // unlimited queueing
    connectionLimit : 0 // unlimited connections
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
function obtainAllCourses(connection, student_id, callback){
  let query = 'SELECT * \
  FROM Takes INNER JOIN Student ON Takes.student_id = Student.student_id \
  INNER JOIN Course ON Course.course_id = Takes.course_id \
  WHERE Student.student_id = ?';
  connection.query(query, student_id, (err, result) => {
    if(err){                                               // query failed
      console.log(err);
    }else{
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

// TODO: REPLACE TEACHER_ID WITH LOGIN_ID SOMEHOW???

/**
 * obtains all the addable courses for the teacher to teach
 *
 * @param {*} connection
 * @param {*} callback
 */
function obtainAddableCourses(connection, teacher_id, callback){
  let query = 'SELECT course_id, course_name, course_title \
  FROM Teacher INNER JOIN Course ON Teacher.discipline_id = Course.discipline_id \
  WHERE Teacher.teacher_id = ?';

  connection.query(query, teacher_id, (err, result) => {
    if(err){                                               // query failed
      console.log(err);
    }else{
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

/**
 * obtains all the courses that the professor is teaching
 *
 * @param {*} connection
 * @param {*} callback
 */
 function obtainTeachingCourses(connection, teacher_id, callback){
  let query = 'SELECT Course.course_id, Course.course_name, Course.course_title \
  FROM Teacher INNER JOIN Teaches ON Teacher.teacher_id = Teaches.teacher_id \
  INNER JOIN Course ON Teaches.course_id = Course.course_id \
  WHERE Teacher.teacher_id = ?';

  connection.query(query, teacher_id, (err, result) => {
    if(err) {                                               // query failed
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
function obtainAllProfessors(connection, student_id, callback){
  let query = '\
  SELECT name\
  FROM Teacher, Teaches, Course \
  WHERE Teacher.teacher_id = Teaches.teacher_id AND Teaches.course_id = Course.course_id \
  AND Course.course_id IN (SELECT Course.course_id FROM Course, Takes, Student \
  WHERE Course.course_id = Takes.course_id AND Takes.student_id = ? )';
  connection.query(query, student_id, (err, result) => {
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
function obtainQuestions(connection, stud_id, callback) {
  let query = '\
     SELECT DISTINCT * \
     FROM Question INNER JOIN Student \
     ON Question.student_id = Student.student_id \
     WHERE Question.student_id = ?';
  connection.query(query, stud_id, (err, result) => {
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
function searchProfessor(connection, input, sort, order, callback) {
  let replacement = `'%${input}%'`;
  let query = 'SELECT * FROM Teacher WHERE name like '+replacement;

  if (!(sort === "")) {
    query += ' ORDER BY ' + sort + ' ' + order;
  }

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
 * searches professor from user input.
 *
 * @param {*} connection
 * @param {*} input
 * @param {*} callback
 */
function searchProfessorByName(connection, input, callback) {
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

  if (!(sort === "")) {
    query += ' ORDER BY ' + sort + ' ASC';
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
      callback(qid);
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
  console.log(typeof course_id, course_id);
  // If the instructor does not have any courses in the sessions table
  if(course_id.length < 4){
    callback('None');
  } else {
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
}


/**
 * Obtains the user inputted course information.
 *
 * This function is primarily used for displaying the course information when the user
 * clicks on the course they are trying to answers questions from.
 *
 * @param {*} connection
 * @param {string} course_id the course id we are trying to get questions from
 * @param {*} callback
 */
 function obtainCourseInfo(connection, course_id, callback) {
  let query = '\
  SELECT * \
  FROM Course \
  WHERE course_id = ' + course_id;

  connection.query(query, (err, result) => {
    if(err) {
      console.log("cannot find session for ",teacher);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

/**
 * obtains all the questions from a single course.
 *
 * This function is primarily used for displaying all the questions related
 * to the course the professor picks.
 *
 * @param {*} connection
 * @param {string} course_id the course id we are trying to get questions from
 * @param {*} callback
 */
 function obtainQuestionFromACourse(connection, course_name, question_id, callback) {
  let query = "\
  SELECT * \
  FROM Question INNER JOIN Containsqueue ON Question.question_id = Containsqueue.question_id INNER JOIN Course ON Course.course_id = Question.course_id \
  WHERE Course.course_name='"+course_name+"' ";

  if(!(question_id==="")){
    query = query + " AND Question.question_id='"+question_id+"' ";
  }
  query = query + " ORDER BY POSITION";

  connection.query(query, (err, result) => {
    if(err) {
      console.log("Cannot obtain questions from inputted course!");
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

function locateQueue(connection, sess_id, callback) {
  let query = 'SELECT queue_id FROM Queue WHERE session_id = ?';
  connection.query(query, sess_id[0].session_id, (err, result) => {
    if (err) {
      console.log("cannot locate queue", err);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

/**
 * obtains all the questions from course that professors teach and orders them by course
 *
 * @param {*} connection
 * @param {string} teacher_id the teacher id of the professor
 * @param {*} callback
 */
function obtainQuestionFromCourses(connection, teacher_id, callback) {
  let query = '\
  SELECT * \
  FROM Teaches INNER JOIN Question ON Teaches.course_id = Question.course_id \
  WHERE teacher_id = ' + teacher_id +' \
  ORDER BY Question.course_id';

  connection.query(query, (err, result) => {
    if(err) {
      console.log("Cannot obtain questions from courses!");
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

function createSessionID(connection, callback) {
  let query = 'SELECT MAX(session_id) AS largestId FROM Session WHERE 1=1';
   connection.query(query, (err, result) => {
     if (err) {
     console.log("Cannot find max queue_id");
     } else {
     result = JSON.parse(JSON.stringify(result[0])).largestId;
     console.log(result);
     callback(result);
     }
   });
}

function createSession(connection, courseid, callback) {
  createSessionID(connection, function(sesh_id) {
    sesh_id +=1;
    let query = 'INSERT INTO Session(session_id, course_id, schedule_id) \
    VALUES(?, ?, ?)';
    connection.query(query, [sesh_id, courseid, sesh_id], (err, result) => {
      if (err) {
        console.log("cannot create session", err);
      } else {
        result = JSON.parse(JSON.stringify(result));
        callback(result);
      }
    });
  });
}

function getDiscipline(connection, courseid, callback) {
  let query = 'SELECT discipline_id FROM Course WHERE course_id = ?';
  connection.query(query, courseid, (err, result) => {
    if (err) {
      console.log("CANNOT find discipline_id", err);
    } else {
      result = JSON.parse(JSON.stringify(result))[0].discipline_id;
      callback(result);
    }
  });
}

/**
 * obtains all the question count from course that professors teach and orders them by course
 *
 * @param {*} connection
 * @param {string} teacher_id the teacher id of the professor
 * @param {*} callback
 */
 function obtainQuestionCountFromCoursesTaught(connection, teacher_id, callback) {
  let query = '\
  SELECT TCTable.course_id, TCTable.course_name, TCTable.course_title, IFNULL(QCTable.questionCounts,0) AS questionCount \
  FROM \
  (SELECT Question.course_id, COUNT(Question.course_id) AS questionCounts \
  FROM Question INNER JOIN Teaches ON Teaches.course_id = Question.course_id \
  WHERE teacher_id = '+teacher_id+' AND Question.question_status=0 \
  GROUP BY Question.course_id) AS QCTable \
  RIGHT JOIN \
  (SELECT Course.course_id, Course.course_name, Course.course_title \
  FROM Teacher INNER JOIN Teaches ON Teacher.teacher_id = Teaches.teacher_id INNER JOIN Course ON Teaches.course_id = Course.course_id \
  WHERE Teacher.teacher_id = '+teacher_id+') AS TCTable ON QCTable.course_id = TCTable.course_id';

  connection.query(query, (err, result) => {
    if(err) {
      console.log("Cannot obtain question counts from courses!");
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

//// Queue section

function getQueueID(connection, callback){
 let query = 'SELECT MAX(queue_id) AS max_num FROM Queue WHERE 1=1';
  connection.query(query, (err, result) => {
    if (err) {
      console.log("Cannot find max queue_id");
    } else {
      result = JSON.parse(JSON.stringify(result))[0].max_num;
      if (result == null) {
        result = 0
      }
      callback(result);
    }
  });
}

function obtainQuestionID(connection, question_str) {
  let query = 'SELECT question_id FROM Question WHERE \
  question_title = question_str';
  connection.query(query, (err, result) => {
    if (err) {
      console.log("CANNOT find question_id", err);
    }else {
      result = JSON.parse(JSON.stringify(result));
      return result;
    }
  });
}

function obtainSessionID(connection, courseid, callback) {
  let query = 'SELECT session_id FROM Session WHERE \
  course_id = ?';
  connection.query(query, courseid, (err, result) => {
    if (err) {
      console.log("CANNOT find question_id", err);
    }else {
      result = JSON.parse(JSON.stringify(result));
      console.log('res is',result);
      callback(result);
    }
  });
}

function obtainMaxPosition(connection, qid, callback) {
  let query = 'SELECT MAX(position) as maxPos FROM Containsqueue WHERE queue_id = ?';
  connection.query(query, qid, (err, result) => {
    if (err) {
      console.log("Error locating max queue position");
    } else {
      console.log(result);
      result = JSON.parse(JSON.stringify(result))[0].maxPos;
      callback(result);
    }
  });
}

function insertStudentIntoQueue(connection, stud_id, quest_id, queue_id, callback) {
  console.log("q (SHOULD BE CREATED ALREADY) id is: ", queue_id);
  obtainMaxPosition(connection, queue_id, function(position) {
    console.log("Position is ", position);
    if(position == null) {
      position = 1;
    }
    else{
      position+=1;
      //queue_id = queue_id[0].queue_id;
    }
    console.log("S_ID: ",stud_id);
    console.log("QUEUE_ID: ",queue_id);
    console.log("POS: ",position);
    console.log("QUEST_ID: ",quest_id);
    let query = 'INSERT INTO Containsqueue(student_id, queue_id, position, question_id) \
    VALUES(?, ?, ?, ?)';
    connection.query(query, [stud_id, queue_id, position, quest_id], (err, result) => {
      if(err) {
        console.log("Error inserting student into queue", err);
      } else {
        result = JSON.parse(JSON.stringify(result));
        callback(result);
      }
    });
  });
}

function insertIntoQueue(connection, course_id, callback) {
  getQueueID(connection, function(que_id) {
    que_id +=1;
    getDiscipline(connection, course_id, function(discipline) {
      console.log(que_id, course_id);
      obtainSessionID(connection, course_id, function(session) {
        console.log('insert is ', que_id, discipline, session[0].session_id);
        var sesh_id = session[0].session_id;
        let query = 'INSERT INTO Queue(queue_id, teacher_id, discipline_id, session_id) VALUES(?, ?, ?, ?)';
        connection.query(query, [que_id, 0000000, discipline, sesh_id], (err, result) => {
          if (err) {
            console.log("CANNOT create queue", err);
          } else {
            result = JSON.parse(JSON.stringify(result));
            callback(que_id);
          }
        });
      });
    });
  });
}

function findCurrentPosition(connection, quest_id, callback) {
  let query = 'SELECT * FROM Containsqueue WHERE \
  question_id IN '+quest_id;
  connection.query(query, (err, result) => {
    if(err || result == null) {
      console.log("Cannot locate current pos in queue");
      callback(result);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

function obtainCourseByQuestionId(connection, quest_id, callback) {
  let query = 'SELECT course_name FROM Course \
  INNER JOIN Question \
  ON Question.course_id = Course.course_id \
  AND Question.question_id IN '+quest_id;
   connection.query(query, (err, result) => {
     if (err || result == null) {
       console.log("Cannot locate course with question id: ", quest_id);
       callback(result);
     } else {
       result = JSON.parse(JSON.stringify(result));
       callback(result);
     }
   });
}

function obtainAllQuestionInfo(connection, quest_id, callback) {
  let query = 'SELECT * FROM Containsqueue\
   INNER JOIN Question \
   ON Question.question_id = Containsqueue.question_id \
   INNER JOIN Course \
   ON Course.course_id = Question.course_id \
   WHERE Question.question_id IN '+quest_id;
   connection.query(query, (err, result) => {
     if (err) {
       console.log("could not locate all data from question_id");
     } else {
       result = JSON.parse(JSON.stringify(result));
       callback(result);
     }
   });
}

function obtainAllQuestionInfoByStudentID(connection, student_id, callback) {
  let query = 'SELECT * FROM Containsqueue\
   INNER JOIN Question \
   ON Question.question_id = Containsqueue.question_id \
   INNER JOIN Course \
   ON Course.course_id = Question.course_id \
   WHERE Question.student_id = '+student_id;
   connection.query(query, (err, result) => {
     if (err) {
       console.log("could not locate all data from question_id");
     } else {
       result = JSON.parse(JSON.stringify(result));
       callback(result);
     }
   });
}

function checkIfExists(connection, stud_id, callback) {
  let query = 'SELECT * FROM Student WHERE student_id = ?';
  connection.query(query, stud_id, (err, result) => {
    if(err) {
      console.log("Cannot locate student with id: ", stud_id, err);
      callback(result);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

function insertStudent(connection, stud_id, stud_email, stud_name, callback) {
  checkIfExists(connection, stud_id, function(results) {
    // If the student already exists do not try to re-insert
    console.log(typeof results, results);
    if(!results) {
      console.log("Student already exists");
      callback(results);
    } else {
      let query = 'INSERT INTO Student(student_id, email, name) VALUES(?, ?, ?)';
      connection.query(query, [stud_id, stud_email, stud_name], (err, result) => {
        if(err) {
          console.log("Could not insert student with ID: ", stud_id, err);
          callback(result);
        } else {
          console.log(result);
          result = JSON.parse(JSON.stringify(result));
          callback(result);
        }
      });
    }
  });
}

/**
 * Obtains all the answered questions by the inputted student_id
 *
 * @param {*} connection
 * @param {string|number} student_id the inputted student id we are trying to get answers from
 * @param {*} callback
 */
function obtainAnsweredQuestionsByStudentID(connection, student_id, callback) {
  let query = 'SELECT * FROM \
  Question INNER JOIN Answer \
  ON Question.question_id = Answer.question_id \
  WHERE Question.student_id = '+student_id;
  connection.query(query, (err, result) => {
    if (err) {
      console.log("Cannot obtain the answered questions by student ID !!!!");
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

function getQuestionLabel(connection, teachesid, callback) {
  let query = 'SELECT DISTINCT Question.label, Course.course_name \
  FROM Question \
  INNER JOIN Session \
  ON Session.course_id = Question.course_id \
  INNER JOIN Answer \
  ON Answer.question_id = Question.question_id \
  INNER JOIN Course \
  ON Course.course_id = Question.course_id \
  WHERE Answer.teacher_id = ?';

  connection.query(query, teachesid, (err, result) => {
    if(err) {
      console.log("Could not find label with teacherid: ", teachesid, err);
      callback(result)
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

function getQuestionInfo(connection, label, teachesid, callback) {
  let query = 'SELECT DISTINCT * \
  FROM Question \
  INNER JOIN Session \
  ON Session.course_id = Question.course_id \
  INNER JOIN Answer \
  ON Answer.question_id = Question.question_id \
  WHERE Answer.teacher_id = ?';

  if (!(label === "")){
  query += " AND Question.label = '"+label+"' ";
  }

  connection.query(query, teachesid, (err, result) => {
    if(err) {
      console.log("Could not find label with teacherid: ", teachesid, err);
      callback(result)
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

function matchEmailInfo(connection, email, callback) {
  let query = 'SELECT teacher_id \
  FROM Teacher \
  WHERE email= ? ';
  connection.query(query, email, (err, result) => {
    if(err) {
      console.log("Could not find email from list: ", email);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

/****************
 * SCHEDULE Section
 *****************/

function obtainScheduleID(connection, callback) {
  let query = 'SELECT MAX(schedule_id) AS max_id FROM Session WHERE 1=1';
   connection.query(query, (err, result) => {
     if (err) {
       console.log("Cannot find max schedule id");
       callback(err);
     } else {
       result = JSON.parse(JSON.stringify(result))[0].max_id;
       if (result == null) {
         result = 0
       }
       callback(result);
     }
   });
}

function editSchedule(connection, available_day, from_day, to_time, teaches_id, course_id, callback) {
  let query = 'UPDATE Schedule \
  INNER JOIN Session \
  ON Session.schedule_id = Schedule.schedule_id \
  SET available_day = ?, from_time = ?, to_time = ? \
  WHERE \
  teacher_id = ? \
  AND \
  course_id = ?;';
  connection.query(query, [available_day, from_day, to_time, teaches_id, course_id], (err, result) => {
    if (err) {
      console.log("Could not edit schedule for: ", teaches_id);
      callback(err);
    } else {
      callback(result);
    }
  });
}

function createSchedule(connection, courseid, teaches_id, available_day, from, to, zoom, callback) {
  //TODO: SETH THIS ZOOM VARIABLE IS FOR YOU!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  var zoom = "";

  obtainScheduleID(connection, function(sched_id) {
    console.log("max schedule id is: ",sched_id);
    sched_id +=1;
    console.log("max schedule id AFTER INCREMENTING: ",sched_id);
    obtainSessionID(connection, courseid, function(sesh_id) {

      // session already created, insert into schedule table
      if(sesh_id.length > 0) {
        console.log("session already created for session: ",sesh_id);

        let query = 'INSERT INTO Schedule(teacher_id, schedule_id, available_day, from_time, to_time, zoom_link, zoom_link_passwd) \
        VALUES(?, ?, ?, ?, ?, ?, ?)';
        connection.query(query, [teaches_id, sesh_id[0].session_id, available_day, from, to, zoom, "", teaches_id], (err, result) => {
          if (err) {
            console.log("Could not create schedule for: ", teaches_id);
            callback(err);
          } else {
            callback(result);
          }
        });
      }
      // Session not created, create session and add new schedule
      else {
        createSession(connection, courseid, function(result) {
          let query = 'INSERT INTO Schedule(teacher_id, schedule_id, available_day, from_time, to_time, zoom_link, zoom_link_passwd) \
          VALUES(?, ?, ?, ?, ?, ?, ?)';
          connection.query(query, [teaches_id, sched_id, available_day, from, to, zoom, "", teaches_id], (err, result) => {
            if (err) {
              console.log("Could not create schedule for: ", teaches_id);
              callback(err);
            } else {
              callback(result);
            }
          });
        });
      }
    });
  });
}

function obtainSchedule(connection, teacher, callback) {
  let query = 'SELECT * FROM Schedule WHERE teacher_id = ?';
  connection.query(query, teacher, (err, result) => {
    if(err) {
      console.log("cannot find session for ",teacher);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

function obtainScheduleAndSession(connection, teacher, callback) {
  let query = 'SELECT * FROM Schedule INNER JOIN Session ON Session.schedule_id = Schedule.schedule_id \
  WHERE teacher_id = ?';
  connection.query(query, teacher, (err, result) => {
    if(err) {
      console.log("cannot find session for ",teacher);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

function obtainProfessorSchedule(connection, teacher_id, course_id, callback) {
  let query = '\
  SELECT * \
  FROM Session INNER JOIN Schedule ON Session.schedule_id = Schedule.schedule_id \
  INNER JOIN Course ON Course.course_id = Session.course_id \
  WHERE Schedule.teacher_id= ?';

  if (!(course_id === "")) {
    query += " AND Session.course_id = '"+ course_id +"' ";
  }

  connection.query(query, teacher_id, (err, result) => {
    if (err) {
      console.log("Could not find schedule for: ", teacher_id);
      callback(err);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

/**
 * exports the modules for the other .js files to use
 */
module.exports = {
  configDatabase,
  askQuestion,
  createSession,
  insertIntoQueue,
  insertStudentIntoQueue,
  findCurrentPosition,
  getQuestionID,
  locateQueue,
  searchProfessor,
  searchCourses,
  searchQuestions,
  obtainAddableCourses,
  obtainAllCourses,
  obtainAllProfessors,
  obtainAllQuestionInfo,
  obtainAllQuestionInfoByStudentID,
  obtainAllQuestions,
  obtainAllTaught,
  obtainAnsweredQuestionsByStudentID,
  obtainCourseByQuestionId,
  obtainCourseInfo,
  obtainProfessorSchedule,
  obtainQuestions,
  obtainQuestionFromACourse,
  obtainQuestionFromCourses,
  obtainQuestionCountFromCoursesTaught,
  obtainSession,
  obtainSessionID,
  obtainTeaches,
  obtainTeachingCourses,
  insertStudent,
  searchProfessorByName,
  getQuestionLabel,
  getQuestionInfo,
  matchEmailInfo,
  editSchedule,
  createSchedule,
  obtainSchedule,
  obtainScheduleAndSession

};
