//Load HTTP module
const http = require("http");
// const hostname = '127.0.0.1';
// const port = 8080;
const bwipjs = require('bwip-js');

//Create HTTP server and listen on port 3000 for requests

http.createServer(function(req, res) {
  // If the url does not begin /?bcid= then 404.  Otherwise, we end up
  // returning 400 on requests like favicon.ico.
  if (req.url.indexOf('/?bcid=') != 0) {
      res.writeHead(404, { 'Content-Type':'text/plain' });
      res.end('BWIPJS: Unknown request format.', 'utf8');
  } else {
      bwipjs.request(req, res); // Executes asynchronously
  }

}).listen(3030);

//listen for request on port 3000, and as a callback function have the port listened on logged
// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

