
let myFont;

let robot;
let object;
let tracker;
let w;
let h;

let socket;
const DEBUG = false;

function preload() {
  robot = new Robot(1,0,0, 0,1,0, 0,0,1, 0,0,0);
  tracker = new Tracker(-1, 0, 0, 0, 0, -1, 0, -1, 0, 100, 150, 100);
  let myModel = loadModel('assets/simple_pyramid_3.stl', false);
  object = new STLObject(1,0,0, 0,1,0, 0,0,1, 50,20,100, myModel);
  myFont = loadFont('assets/Montserrat.otf');
  w = window.innerWidth-20;
  h = window.innerHeight-20;
}

function setup() {
  createCanvas(w,h, WEBGL);
  textFont(myFont);
  textSize(32);
  textAlign(CENTER, CENTER);

  socket = io.connect("localhost:3000");
  socket.on("message", newMessage);
  socket.on("pos", gotNewPos);
  socket.on("marker", sendMarker);
  socket.on("effector", sendEffector);
  tracker.update(robot.effector.m);

  createEasyCam();

  document.oncontextmenu = function() { return false; }
}

function sendMarker() {
  let m = Matrix.transpose(tracker.marker.m.matrix).matrix;
  let s = millis() +" y ";
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col <= 3; col++) {
      s += m[row][col]+" ";
    }    
  }
  s += "1";
  socket.emit("marker", s);
}

function sendEffector(data) {
  let m = Matrix.transpose(robot.effector.m.matrix).matrix;
  let s = "";
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col <= 3; col++) {
      s += m[row][col]+" ";
    }    
  }
  socket.emit("effector", s);
}

function newMessage(data){
  console.log(data);
}

function gotNewPos(data) {
  let pos = data.split(" ");
  robot.effector.m.set(pos);
  tracker.update(robot.effector.m);
  socket.emit("response", true);
}

function draw() {
  smooth();
  background(51);
  showGrid(200, 200);
  fill(255, 0, 0);
  text("X", -width/8,-height/4);
  fill(0, 255, 0);
  text("Y", -width/8,-height/4+32)
  fill(0, 0, 255);
  text("Z", -width/8,-height/4+64)
  applyMatrix(
      0,0,1,0,
      1,0,0,0,
      0,-1,0,0,
      0,0,0,1
  );
  robot.show();
  tracker.show(robot);
  object.show();
  
  //orbitControl();
}

function showGrid(size, len){
  stroke(255);
  strokeWeight(1);
  for(let x=-len;x<=len;x+=size) {
    for(let z=-len;z<=len;z+=size) {
      line(-len,0,z,len,0,z);
      line(x,0,-len,x,0,len);
    }
  }

}
/*
function newTable(m) {
  for (let r = 0; r<m.length; r++) {
    let p = document.createElement("p");
    let s = "";
    for (let c = 0; c < m[0].length; c++){
      s = s+" "+m[r][c]+" ";
    }
    p.innerHTML = s;
    document.body.appendChild(p);
  }
  document.body.appendChild(document.createElement("br"));

}
*/