var express = require('express');
var app = express();
var server =  app.listen(3000, '127.0.0.1', listen);
var io = require('socket.io')(server);
var net = require('net');

let responseState = false;

let browser;
let program;

// Server setup for the program
var robServer = net.createServer(function(client) {
  console.log("New program client connected");
  program = client;
  client.on('data', function(buff) {
    let data = buff.toString();
    processData(data);
  });
  client.on('error', (err) => console.log(err));
});
robServer.listen(5005, '127.0.0.1', () => console.log('Robot Server listening at port 5005'));

// Server setup for the Website
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('StyroCutRobot WebApp listening at http://' + host + ":" + port);
}
app.use(express.static('public'));

function processData(data) {
  let dataArr = data.split(" ");
  switch (dataArr[0].toLowerCase()) {
    case "moveminchangerowwisestatus":
      console.log("Changing effectors position...");
      browser.emit("pos", data);
      break;
    case "quit":
      console.log("Closing connection to program...");
      program.write("disconnected");
      program.destroy();
      return;
    case "hello":
      program.write("accepted");
      return;
    default:
      console.log("Unsupported command");
      console.log(dataArr[0]);
  }
  program.write(""+responseState);
}


// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', function (socket) {
  console.log("A client has connected");
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
