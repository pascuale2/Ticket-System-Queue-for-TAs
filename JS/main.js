const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3200;

/*
 * Create a http server running on port 3200
*/
const server = http.createServer(function(req, res) {
  let filePath = path.join(
    __dirname,
    "..",
    req.url === "/" ? "/HTML/home.html": req.url
  );

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
