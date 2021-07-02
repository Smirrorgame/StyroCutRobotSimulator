var express = require('express');
var app = express();
var server =  app.listen(3000, '127.0.0.1', listen);
var io = require('socket.io')(server);
var net = require('net');

let responseState = false;

let browser;
let robots = {
  cutter: null,
  holder: null,
};
let tracker;

// Server setup for the Robot program
net.createServer(function(client) {
  if (robots.cutter) {
    console.log("New Holder Robot connected");
    robots.holder = client;
  }
  else {
    console.log("New Cutter Robot connected");
    robots.cutter = client;
  }
  client.on('data', function (buff) {
    let data = buff.toString();
    processRobotData(data, client);
  });
  client.on('close', () => {
    switch (client) {
      case robots.cutter:
        console.log("Cutter Robot has disconnected");
        robots.cutter = null;
        break;
      case robots.holder:
        console.log("Holder Robot has disconnected");
        robots.holder = null;
        break;
      default:
        break;
    }
    
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

function processRobotData(data, robot) {
  if (robot == robots.cutter) processCutter(data);
  else if (robot == robots.holder) processHolder(data);
  else {
    console.log("Error, no Robot match!");
  }
}

function processCutter(data) {
  let robot = robots.cutter;
  let dataArr = data.split(" ");
  switch (dataArr[0].toLowerCase()) {
    case "moveminchangerowwisestatus":
      console.log("Changing effectors position...");
      browser.emit("posCutter", data);
      break;
    case "getpositionhomrowwise":
      console.log("Getting Cutter effectors position...");
      browser.emit("effCutter", data);
      return;
    case "isadept":
      console.log("Check if Robot is Adept Robot");
      responseState = true;
      break;
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
  robot.write(""+responseState);
}

function processHolder(data) {
  let robot = robots.holder;
  let dataArr = data.split(" ");
  switch (dataArr[0].toLowerCase()) {
    case "moveminchangerowwisestatus":
      console.log("Changing effectors position...");
      browser.emit("posHolder", data);
      break;
    case "getpositionhomrowwise":
      console.log("Getting Holder effectors position...");
      browser.emit("effHolder", data);
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
  robot.write(""+responseState);
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
    case "cm_getsystem\n":
      tracker.write("Tracking Simulator");
      return;
    case "cm_gettrackers\n":
      tracker.write("Tracker01 Tracker02");
      return;
    case "tracker01":
      tracker.write("ANS_TRUE");
      return;
    case "format_matrixrowwise\n":
      tracker.write("ANS_TRUE");
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
  
    socket.on('posCutter',
      function(data) {
        responseState = data;
      }
    );
    socket.on('posHolder',
      function(data) {
        responseState = data;
      }
    );
    socket.on('marker',
      function (data) {
        console.log("marker:");
        console.log(data);
        tracker.write(data);
      }
    );
    socket.on('effCutter',
      function (data) {
        console.log("Cutter effector:");
        console.log(data);
        robots.cutter.write(data);
      }
    );
    socket.on('effHolder',
      function (data) {
        console.log("Holder effector:");
        console.log(data);
        robots.holder.write(data);
      }
    );
    socket.on('disconnect',
      function () {
        console.log("Client has disconnected");
      }
    );
  }
);
