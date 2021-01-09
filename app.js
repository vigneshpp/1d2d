//Load HTTP module
const http = require("http");
const bwipjs = require('bwip-js');
//const hostname = '127.0.0.1';
const port = 80;

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

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, () => {
  console.log(`Server running at PORT:${port}/`);
});

// console.log(`Server now running!`);

// //listen for request on port 3000, and as a callback function have the port listened on logged
// server.listen (port, hostname, () => {
// console.log(`Server running at http://${hostname}:${port}/`);
// });

