
let myFont;

let cutter;
let holder;
let activeRobot;
let object;
let tracker;

let checkbox;
let DEBUGcheckbox;

let socket;
let DEBUG = false;

/* function to setup the sketch */

function preload() {
  cutter = new Robot(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, "C");
  holder = new Robot(1,0,0, 0,1,0, 0,0,1, 0,200,0, "H");
  tracker = new Tracker(-1, 0, 0, 0, 0, -1, 0, -1, 0, 100, 150, 100);
  let myModel = loadModel('assets/simple_pyramid_3.stl', false);
  object = new STLObject(1,0,0, 0,1,0, 0,0,1, 50,20,100, myModel);
  myFont = loadFont('assets/Montserrat.otf');
  
  activeRobot = cutter;
}

function setup() {
  createCanvas(windowWidth-20,windowHeight-70, WEBGL);
  textFont(myFont);
  textSize(32);
  textAlign(CENTER, TOP);

  socket = io.connect("localhost:3000");
  socket.on("message", newMessage);
  socket.on("posCutter", posCutter);
  socket.on("posHolder", posHolder);
  socket.on("marker", sendMarker);
  socket.on("effCutter", effCutter);
  socket.on("effHolder", effHolder);
  tracker.update();

  createEasyCam();
  document.oncontextmenu = function () { return false; }
  checkbox = createCheckbox('Tracker on Cutter', true);
  checkbox.changed(() => {
    if (checkbox.checked()) {
      activeRobot = cutter;
      console.log("Tracker now on Cutter");
    }
    else {
      activeRobot = holder;
      console.log("Tracker now on Holder");
    }
    tracker.update()
  });

  DEBUGcheckbox = createCheckbox('DEBUG', false);
  DEBUGcheckbox.changed(() => {
    if (DEBUGcheckbox.checked()) {
      DEBUG = true;
    }
    else {
      DEBUG = false;
    }
  });
}

/* function to draw stuff */

function draw() {
  smooth();
  background(51);
  showGrid(4, 800);
  fill(255, 0, 0);
  text("X", -width/4,-height/4);
  fill(0, 255, 0);
  text("Y", -width/4,-height/4+32)
  fill(0, 0, 255);
  text("Z", -width/4, -height / 4 + 64)
  fill(255);
  text("Remember to set\n Marker position\n with the checkbox", -width/4,-height/4+96)
  applyMatrix(
      0,0,1,0,
      1,0,0,0,
      0,-1,0,0,
      0,0,0,1
  );
  cutter.show();
  holder.show();
  tracker.show();
  //object.show();
}

function showGrid(ratio, len){
  stroke(255);
  strokeWeight(1);
  for(let x=-len;x<=len;x+=len/ratio) {
    for(let z=-len;z<=len;z+=len/ratio) {
      line(-len,0,z,len,0,z);
      line(x,0,-len,x,0,len);
    }
  }

}

/* functions to send Data back to socket connection */

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

function effCutter(data) {
  let m = Matrix.transpose(cutter.getEffector().m.matrix).matrix;
  let s = "";
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col <= 3; col++) {
      s += m[row][col]+" ";
    }    
  }
  socket.emit("effCutter", s);
}

function effHolder(data) {
  let m = Matrix.transpose(holder.getEffector().m.matrix).matrix;
  let s = "";
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col <= 3; col++) {
      s += m[row][col]+" ";
    }    
  }
  socket.emit("effCutter", s);
}

function posCutter(data) {
  let pos = data.split(" ");
  cutter.setEffector(pos);
  tracker.update();
  socket.emit("posCutter", true);
}

function posHolder(data) {
  let pos = data.split(" ");
  holder.setEffector(pos);
  tracker.update();
  socket.emit("posHolder", true);
}

function newMessage(data){
  console.log(data);
}
