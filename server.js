var express = require('express');
var app = express();
var server =  app.listen(3000, listen);
var io = require('socket.io')(server);

let responseState = false;

let browser;
let program;

var net = require('net');

var robServer = net.createServer(function(client) {
  console.log("new program client");
  program = client;
  client.on('data', function(buff) {
    data = buff.toString();
    processData(data);
  });
  client.on('error', (err) => console.log(err));
});
robServer.listen(5005, '127.0.0.1');

function processData(data) {
  let dataArr = data.split(" ");
  switch (dataArr[0].toLowerCase()) {
    case "moveminchangerowwisestatus":
      console.log("changing position...");
      browser.emit("pos", data);
      break;
    case "quit":
      console.log("Quitting...");
      program.write("disconnected");
      program.destroy();
      return;
      break;
    case "hello":
      program.write("accepted");
      return;
    default:
      console.log("unknown command");
      console.log(dataArr[0]);
  }
  program.write(""+responseState);
}

// This call back just tells us that the server has been started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('StyroCutRobot app listening at http://' + host + ":" + port);
}
app.use(express.static('public'));

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
    browser = socket;
    socket.on('message',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: " + data);
        socket.broadcast.emit("pos", data);
        socket.emit("pos", data);
      }
    );
    socket.on('response',
      function(data) {
        responseState = data;
      }
    );

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);
