class Marker {
    constructor(n1,n2,n3, o1,o2,o3, p1,p2,p3, x,y,z) {
        this.m = new Matrix(n1, n2, n3, o1, o2, o3, p1, p2, p3, x, y, z);
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
            text("M", 0, 0);
        }

        pop();
    }
}
  