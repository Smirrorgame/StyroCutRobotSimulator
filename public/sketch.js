
let myFont;

let base;
let effector;
let object;

let socket;

function preload() {
  base = new CoordinateSystem(1,0,0, 0,1,0, 0,0,1, 0,0,0);
  effector = new CoordinateSystem(1, 0, 0, 0, 0, -1, 0, 1, 0, 50, 50, 200);
  object = new STLObject(1, 0, 0, 0, 1, 0, 0, 0, 1, 100, 100, 20);
  myFont = loadFont('assets/Montserrat.otf');
}

function setup() {
  createCanvas(1200,600, WEBGL);
  textFont(myFont);
  textSize(32);
  textAlign(CENTER, CENTER);

  socket = io.connect("localhost:3000");
  socket.on("message", newMessage);
  socket.on("pos", gotNewPos);
}

function newMessage(data){
  console.log(data);
}

function gotNewPos(data) {
  let pos = data.split(" ");
  let worked = effector.m.set(pos);
  console.log(worked);
  socket.emit("response", worked);
}

function draw() {
  smooth();
  background(51);
  orbitControl();
  showGrid(50, 200);
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
  base.disp(false);
  effector.disp(true);
  object.show();
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