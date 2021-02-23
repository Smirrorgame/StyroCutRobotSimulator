class Effector {
    constructor(n1,n2,n3, o1,o2,o3, p1,p2,p3, x,y,z) {
        this.m = new Matrix(n1, n2, n3, o1, o2, o3, p1, p2, p3, x, y, z);
        this.counter = 0;
        this.speed = 1;
        this.targetM = new Matrix(n1, n2, n3, o1, o2, o3, p1, p2, p3, x, y, z);
        this.interp = false;
    }

    interpolate(){
      let step = (this.counter*this.speed);
      //calculate new translation;
      let targetX = this.targetM.matrix[3][0];
      let newX = lerp(this.m.matrix[3][0], targetX, step/60);
      let targetY = this.targetM.matrix[3][1];
      let newY = lerp(this.m.matrix[3][1], targetY, step/60);
      let targetZ = this.targetM.matrix[3][2];
      let newZ = lerp(this.m.matrix[3][2], targetZ, step/60);

      let tNX = this.targetM.matrix[0][0];
      let nNX = lerp(this.m.matrix[0][0], tNX, step/60);
      let tNY = this.targetM.matrix[1][0];
      let nNY = lerp(this.m.matrix[1][0], tNY, step/60);
      let tNZ = this.targetM.matrix[2][0];
      let nNZ = lerp(this.m.matrix[2][0], tNZ, step/60);

      let tOX = this.targetM.matrix[0][1];
      let nOX = lerp(this.m.matrix[0][1], tOX, step/60);
      let tOY = this.targetM.matrix[1][1];
      let nOY = lerp(this.m.matrix[1][1], tOY, step/60);
      let tOZ = this.targetM.matrix[2][1];
      let nOZ = lerp(this.m.matrix[2][1], tOZ, step/60);

      let tPX = this.targetM.matrix[0][2];
      let nPX = lerp(this.m.matrix[0][2], tPX, step/60);
      let tPY = this.targetM.matrix[1][2];
      let nPY = lerp(this.m.matrix[1][2], tPY, step/60);
      let tPZ = this.targetM.matrix[2][2];
      let nPZ = lerp(this.m.matrix[2][2], tPZ, step/60);

      this.m.matrix[3][0] = newX;
      this.m.matrix[3][1] = newY;
      this.m.matrix[3][2] = newZ;

      this.m.matrix[0][0] = nNX;
      this.m.matrix[1][0] = nNY;
      this.m.matrix[2][0] = nNZ;

      this.m.matrix[0][1] = nOX;
      this.m.matrix[1][1] = nOY;
      this.m.matrix[2][1] = nOZ;

      this.m.matrix[0][2] = nPX;
      this.m.matrix[1][2] = nPY;
      this.m.matrix[2][2] = nPZ;

      this.counter++;
      if(step>=60) {
        this.counter = 0;
        this.interp = false;
      }
    }

    setPos(pos) {
      this.m.setmat(this.targetM.matrix);
      this.targetM.set(pos);
      this.interp = true;
    }

    turn() {
      applyMatrix(this.m.matrix[0][0], this.m.matrix[0][1], this.m.matrix[0][2], 0,
        this.m.matrix[1][0], this.m.matrix[1][1], this.m.matrix[1][2], 0,
        this.m.matrix[2][0], this.m.matrix[2][1], this.m.matrix[2][2], 0,
        this.m.matrix[3][0], this.m.matrix[3][1], this.m.matrix[3][2], 1);
    }

    show() {
        push();
        //show coordinate system
        if(this.interp){
          this.interpolate();
        }
        this.turn();
        let c_len = 25;
        strokeWeight(3);
        stroke(255,0,0);
        line(0,0,0,c_len,0,0);
        stroke(0,255,0);
        line(0,0,0,0,c_len,0);
        stroke(0,0,255);
        line(0, 0, 0, 0, 0, c_len);
        //show text
        if (DEBUG) {
            fill(127, 127, 127);
            text("E", 0, 0);
        }
        // show effector
        let l = 50;
        let w = 2;
        translate(0,0,l/2);
        noStroke();
        fill(255,255,0);
        box(w, w, l);

        pop();
    }
}
