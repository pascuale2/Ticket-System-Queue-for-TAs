const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const path = require('path');
const port = process.env.PORT || 3200;

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
      return console.log("error" + err.message);               // connection failed
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
const server = http.createServer(function(req, res) {
  let filePath = path.join(
    __dirname,
    "..",
    req.url === "/" ? "/HTML/home.html": req.url
  );
  configDatabase(req, res);                             // Configure the database
  console.log('request to '+ req.url + ' was made');

  //res.write(JSON.stringify(["dr john - Chem", "Dr. Borh - Bio", "Dr Sahm - Physics"]));
  let extName = path.extname(filePath);
  let contentType = 'text/html';

  switch (extName) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  console.log(`File Path: ${filePath}`);
  console.log(`Content Type: ${contentType}`);

  res.writeHead(200, {'Content-Type': contentType});
  var myReadStream = fs.createReadStream(filePath);
  myReadStream.pipe(res);
});
server.listen(port, (err) =>{
  if (err) {
    console.log(`Error: ${err}`);
  } else {
    console.log(`Server listening at port ${port}...`);
  }
});