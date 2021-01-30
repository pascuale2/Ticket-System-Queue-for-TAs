const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {

    req.on('error', (err) => {
        console.error(err);
        req.statusCode = 400;
        req.end();
    });
    res.on('error', (err) => {
        console.error(err);
    });

    if (req.url === '/'){
        res.write(JSON.stringify(["dr john - Chem", "Dr. Borh - Bio", "Dr Sahm - Physics"]));
        res.end();
    }

    if (req.hostname ===  'www.MapleDonut.ca'){
        res.write("new connection to mapledonut.ca");
        res.end();
    }

    if (req.url === '/courses'){
        res.write("all courses");
        res.write(JSON.stringify(["bio","chem","physics"]));
        res.end();
    }
    else {
        res.statusCode = 404;
        res.end();
    }
});

server.listen(3000);
console.log('listening on port 3000...\n');