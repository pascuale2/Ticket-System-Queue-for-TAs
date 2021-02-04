const http = require('http');
const fs = require('fs');

var server = http.createServer(function(req, res) {

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
    var myReadStream = fs.createReadStream(__dirname + '/HTML/index.html', 'utf8');
    myReadStream.pipe(res);
});

server.listen(3200);
console.log('listening on port 3200...\n');