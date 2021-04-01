
/**
 * Purpose: Obtain max answer id in order to generate the next one
 * @param {*} connection
 * @param {*} callback
 */
function getAnswerID(connection, callback){
 let query = 'SELECT MAX(answer_id) AS max_num FROM Answer WHERE 1=1';
  connection.query(query, (err, result) => {
    if (err) {
    console.log("Cannot find max answer");
    } else {
    result = JSON.parse(JSON.stringify(result))[0].max_num;
    if (result == null) {
      result = 0
    }
    callback(result);
    }
  });
}

/**
 * Purpose: set the question status to 1 indicating the question has been answered
 * @param {*} connection
 * @param {*} quest_id - question being answered
 * @param {*} callback
*/
function updateQuestionStatus(connection, quest_id, callback) {
  let query = 'UPDATE Question \
  SET question_status = 1 \
  WHERE question_id = ?';
  connection.query(query, quest_id, (err, result) {
    if (err) {
      console.log("Could not set question status to 1 with quest_id: ", quest_id);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

function deleteTopQueuePos(connection, quest_id, callback) {
  let query = 'DELETE FROM Containsqueue WHERE question_id = ?';
  connection.query(query, quest_id, (err, result) {
    if (err) {
      console.log("Could not delete top position in queue with q_id ", quest_id);
    } else {
      result = JSON.parse(JSON.stringify(result));
      callback(result);
    }
  });
}

function updateCurrentQueue(connection, quest_id, c_id, callback) {
 let query = 'UPDATE Containsqueue \
 INNER JOIN Queue \
 ON Queue.queue_id = Containsqueue.queue_id \
 INNER JOIN Session \
 ON Session.session_id = Queue.session_id \
 SET Containsqueue.position = Containsqueue.position - 1 \
 WHERE Session.course_id = ?';
 connection.query(query, c_id, (err, result) {
   if (err) {
     console.log("Could not updatecurrentqueue with course_id: ",c_id);
   } else {
     deleteTopQueuePos(connection, quest_id, function(deleted)) {
       callback(deleted);
     });
   }
 });
}

/**
 * Purpose: Insert a new answer into the answer table
 * @param {*} connection
 * @param {*} ans_str - Professors answer to the question as a string
 * @param {*} ans_date - Date the question was answered in the format (day-month-year)
 * @param {*} quest_id - question id being answered
 * @param {*} c_id - course id of the question
 */
function insertAnswer(connection, ans_str, ans_date, quest_id, c_id, callback) {
 getAnswerID(connection, function(ans_id) {
   let query = 'INSERT INTO Answer(answer_id, answer_string, answer_date, question_id, course_id) \
   VALUES(?, ?, ?, ?, ?)';
   connection.query(query, [ans_id, ans_str, ans_date, quest_id, c_id], (err, result) {
     if(err) {
       console.log("Could not answer question with quest_id: ", quest_id);
     } else {
       result = JSON.parse(JSON.stringify(result));
       if(result != null) {
         updateQuestionStatus(connection, quest_id, function(updated) {
           updateCurrentQueue(connection, quest_id, c_id, function(queue) {
             console.log("Successfully updated top row with quest_id ",quest_id,
              "and moved all positions by 1");
             callback(result);
           });
         });
       } else {
         callback("could not insert answer into table", err);
       }
     }
   });
 });
}
