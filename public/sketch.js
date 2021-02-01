
let myFont;

let base;
let effector;
let object;

let socket;

let transf = {
  r_e: [],
  e_m: [],
  r_t: [],
  t_m: []
};

function preload() {
  base = new CoordinateSystem(1,0,0, 0,1,0, 0,0,1, 0,0,0);
  effector = new CoordinateSystem(1,0,0, 0,0,-1, 0,1,0, 50,50,200);
  //object = new STLObject(-1,0,0, 0,0,-1, 0,-1,0, 0,100,100);
  object = new STLObject(-1,0,0, 0,-1,0, 0,0,1, 50,20,100);
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
  socket.on("marker", sendMarker);
  socket.on("effector", sendEffector);
  object.update(effector.m);
}

function sendMarker() {
  let m = Matrix.transpose(object.marker.m.matrix).matrix;
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
  let m = Matrix.transpose(effector.m.matrix).matrix;
  let s = "";
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col <= 3; col++) {
      s += m[row][col]+" ";
    }    
  }
  socket.emit("effector", s);
}

function printPoses() {
  console.log("M");
  console.log(effector.m.matrix);
  console.log("X");
  console.log(object.effectorToMarker.matrix);
  console.log("Y");
  console.log(object.coord.m.matrix);
  console.log("N");
  let y_inv = object.coord.m.invert();
  let tmp = Matrix.mult(object.effectorToMarker.matrix, effector.m.matrix);
  let tmp2 = Matrix.mult(tmp, y_inv);
  console.log(tmp2);

  transf.r_e = effector.m.matrix;
  transf.e_m = object.effectorToMarker.matrix;
  transf.r_t = object.coord.m.matrix;
  transf.t_m = tmp2;

}

function newMessage(data){
  console.log(data);
}

function gotNewPos(data) {
  let pos = data.split(" ");
  let worked = effector.m.set(pos);
  object.update(effector.m);
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