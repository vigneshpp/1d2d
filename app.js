#!/usr/bin/env node
//Load HTTP module
const http = require("http");
const bwipjs = require('bwip-js');
const hostname = '0.0.0.0';
const port = 3300;

const server = http.createServer(function(req, res) {
  // If the url does not begin /?bcid= then 404.  Otherwise, we end up
  // returning 400 on requests like favicon.ico.
  //Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  if (req.url.indexOf('/?bcid=') != 0) {
      res.writeHead(404, { 'Content-Type':'text/plain' });
      res.end('BWIPJS: Unknown request format.', 'utf8');
  } else {
      bwipjs.request(req, res); // Executes asynchronously
  }

});

//listen for request on port 3200, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
  console.log(`Server running at Hostname:${hostname}/`);
  console.log(`Server running at Port:${port}/`);
  console.log(`Test link Barcode Code128: http://127.0.0.1:${port}/?bcid=code128&includetext&textalign=center&scale=3&text=BWR-PTD-G46-STW-1-1.5-5.6`);
  console.log(`Test link QRCode: http://127.0.0.1:${port}/?bcid=qrcode&includetext&textalign=center&scale=9&text=test123123testtesttesttest`);
});
