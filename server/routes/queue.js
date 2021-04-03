var db = require('./sql');

function generateQueue(connection, courseid, quest_id, stud_id, callback) {
  db.obtainSessionID(connection, courseid, function(result) {
    if(result.length > 0){                                        // if a current queue exists for that course
      console.log("queue already created for course", courseid);
      db.locateQueue(connection, result, function(queue_id) {     // obtain queue_id of current session and top position in queue
        console.log(queue_id);
        db.insertStudentIntoQueue(connection, stud_id, quest_id, queue_id[0].queue_id, function(queue) {
          console.log("Student inserted into current queue: ", queue_id);
          callback(queue_id);
        });
      });

    } else {                                                    // current queue does not exist for that course
        console.log("\nShould be creating the queue here\n");
        callback(createNewQueue(connection, courseid, quest_id, stud_id));
    }
  });
}

function createNewQueue(connection, courseid, quest_id, stud_id) {
  db.createSession(connection, courseid, function(result) {     // create a session
    db.insertIntoQueue(connection, courseid, function(queue_id) {   // create a new queue
      console.log("Just added session to queue");
      db.insertStudentIntoQueue(connection, stud_id, quest_id, queue_id, function(queue) {
        console.log("Student successfully inserted into new queue: ", queue_id);
        return queue_id;
      });
    });
  });
}

module.exports = {generateQueue};
