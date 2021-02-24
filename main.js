const http = require('http');
const fs = require('fs');
const mysql = require('mysql');


/*
 * Creates a connection to the database
 * @params req: http request, res: http result
 * @return null on success
 */
function configDatabase(req, res) {

  var connection = mysql.createConnection({
    host: "mysql.mapledonut.ca",
    user: "mapledonutca1",
    password: "UQ8P2mdX",
    database: "mapledonut_ca"
  });

  connection.connect(function(err) {
    if(err){
      return console.log("error" + err.message);              // connection failed
    }else{
      console.log("connected to mapledonut_ca");                // connection success
      //let insertQuery = 'INSERT INTO ?? (??,??,??,??) VALUES (?,?,?,?)';
      //let query = mysql.format(insertQuery,["Student","student_id","email","biography",
    //  "discipline_id", 100, "test@gmail.com", "test", 101]);
      let query = 'SELECT * FROM Student';
      // Select all records from teacher table
      connection.query(query, (err, result) => {
        if(err){                                               // query failed
          console.log(err);
        }else{                                                  // query success
          return console.log("result: " + result[0].student_id);
        }
      });

    }
  });


}

/*
 * Create a http server running on port 3200
*/
var server = http.createServer(function(req, res) {
  configDatabase(req, res);                             // Configure the database
    console.log('request to '+req.url + ' was made');

   req.on('error', (err) => {
        console.error(err);
        req.statusCode = 400;
        req.end();
    });
    res.on('error', (err) => {
        console.error(err);
    });
    //res.write(JSON.stringify(["dr john - Chem", "Dr. Borh - Bio", "Dr Sahm - Physics"]));
    res.writeHead(200, {'Content-Type': 'text/html'});
    var myReadStream = fs.createReadStream(__dirname + '/HTML/home.html', 'utf8');
    myReadStream.pipe(res);



});

server.listen(3200);
console.log('listening on port 3200...\n');
