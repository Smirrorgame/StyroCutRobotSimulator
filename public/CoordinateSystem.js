class CoordinateSystem {
  constructor(n1,n2,n3, o1,o2,o3, p1,p2,p3, x,y,z) {
    this.m = new Matrix(n1,n2,n3, o1,o2,o3, p1,p2,p3, x,y,z);
  }

  turn() {
    applyMatrix(this.m.n1, this.m.n2, this.m.n3, 0,
      this.m.o1, this.m.o2, this.m.o3, 0,
      this.m.p1, this.m.p2, this.m.p3, 0,
      this.m.t1, this.m.t2, this.m.t3, 1);
  }

  disp(effector) {
    push();
    this.turn();
    let c_len = 25;
    strokeWeight(3);
    stroke(255,0,0);
    line(0,0,0,c_len,0,0);
    stroke(0,255,0);
    line(0,0,0,0,c_len,0);
    stroke(0,0,255);
    line(0,0,0,0,0,c_len);
    if(effector==true){
      let l = 50;
      let w = 2;
      translate(0,0,l/2);
      noStroke();
      fill(255,255,0);
      box(w,w,l);
    }
    pop();
  }
}
