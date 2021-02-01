var express = require('express');
var app = express();
var server =  app.listen(3000, '127.0.0.1', listen);
var io = require('socket.io')(server);
var net = require('net');

let responseState = false;

let browser;
let robot;
let tracker;

// Server setup for the Robot program
net.createServer(function(client) {
  console.log("New Robot client connected");
  robot = client;
  client.on('data', function(buff) {
    let data = buff.toString();
    processRobotData(data);
  });
  client.on('error', (err) => console.log(err));
}).listen(5005, '127.0.0.1', () => console.log('Robot Server listening at port 5005'));

// Server setup for the Tracker program
net.createServer(function(client) {
  console.log("New Tracking client connected");
  tracker = client;
  client.on('data', function(buff) {
    let data = buff.toString();
    processTrackerData(data);
  });
  client.on('error', (err) => console.log(err));
}).listen(5000, '127.0.0.1', () => console.log('Tracking Server listening at port 5000'));

// Server setup for the Website
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('StyroCutRobot WebApp listening at http://' + host + ":" + port);
}
app.use(express.static('public'));

function processRobotData(data) {
  let dataArr = data.split(" ");
  switch (dataArr[0].toLowerCase()) {
    case "moveminchangerowwisestatus":
      console.log("Changing effectors position...");
      browser.emit("pos", data);
      break;
    case "getpositionhomrowwise":
      console.log("Getting effectors position...");
      browser.emit("effector", data);
      return;
    case "quit":
      console.log("Closing connection to robot program...");
      robot.write("disconnected");
      robot.destroy();
      return;
    case "hello":
      robot.write("accepted");
      return;
    default:
      console.log("Unsupported command");
      console.log(dataArr[0]);
  }
  robot.write("true");
}

function processTrackerData(data) {
  let dataArr = data.split(" ");
  switch (dataArr[0].toLowerCase()) {
    case "cm_nextvalue\n":
      console.log("Getting Marker position...");
      browser.emit("marker", data);
      return;
    case "quit\n":
      console.log("Closing connection to tracker program...");
      tracker.write("disconnected");
      tracker.destroy();
      return;
    case "hello\n":
      tracker.write("accepted");
      return;
    default:
      console.log("Unsupported command");
      console.log(dataArr[0]);
  }
  tracker.write(""+responseState);
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
    socket.on('marker',
      function (data) {
        console.log(data);
        tracker.write(data);
      }
    );
    
    socket.on('effector',
      function (data) {
        console.log(data);
        robot.write(data);
      }
  );

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);
