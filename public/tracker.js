class Tracker {
    constructor(n1,n2,n3, o1,o2,o3, p1,p2,p3, x,y,z) {
        this.m = new Matrix(n1, n2, n3, o1, o2, o3, p1, p2, p3, x, y, z);
        this.marker = new Marker(-1, 0, 0, 0, 1, 0, 0, 0, -1, -50, -100, 40);
        this.y = new Matrix(1,0,0, 0,1,0, 0,0,1, 0,0,0);
        this.effectorToMarker = new Matrix(1,0,0, 0,1,0, 0,0,1, 0,0,10);
    }

    update() {
        let m = activeRobot.effector.m;
        this.y.setmat(Matrix.mult(this.m.matrix, activeRobot.m.invert()));
        let x = this.effectorToMarker;
        let y_inv = this.y.invert();
        let tmp = Matrix.mult(x.matrix, m.matrix);
        let tmp2 = Matrix.mult(tmp, y_inv);
        let n = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        n.setmat(tmp2);

        //################
        //creating noise
        let z = this.randomRot(15);
        n.setmat(Matrix.mult(z,n.matrix));
        this.marker.m.setmat(tmp2);
    }

    randomRot(range) {
        //#########################################
        //creating phases for noise for each possible rotation in the spcified range
        let alpha_x = ((0.5 - random()) * 2)*radians(range);
		let beta_y = ((0.5-random())*2)*radians(range);
		let gamma_z = ((0.5-random())*2)*radians(range);
                
        //extrinsic rotation around fixed axis (Rx-Ry-Rz)
        let a11 = Math.cos(beta_y)*Math.cos(gamma_z);
        let a12 = -Math.cos(beta_y)*Math.sin(gamma_z);
        let a13 = Math.sin(beta_y);
        let a21 = Math.cos(alpha_x)*Math.sin(gamma_z) + Math.cos(gamma_z)*Math.sin(alpha_x)*Math.sin(beta_y);
        let a22 = Math.cos(alpha_x)*Math.cos(gamma_z) - Math.sin(alpha_x)*Math.sin(beta_y)*Math.sin(gamma_z);
        let a23 = -Math.cos(beta_y)*Math.sin(alpha_x);
        let a31 = Math.sin(alpha_x)*Math.sin(gamma_z) - Math.cos(alpha_x)*Math.cos(gamma_z)*Math.sin(beta_y);
        let a32 = Math.cos(gamma_z)*Math.sin(alpha_x) + Math.cos(alpha_x)*Math.sin(beta_y)*Math.sin(gamma_z);
        let a33 = Math.cos(alpha_x) * Math.cos(beta_y);
        let z = new Matrix(a11, a12, a13, a21, a22, a23, a31, a32, a33, ((0.5 - random()) * 2), ((0.5 - random()) * 2), ((0.5 - random()) * 2)).matrix;
        return z;
    }
  
    turn() {
      applyMatrix(this.m.matrix[0][0], this.m.matrix[0][1], this.m.matrix[0][2], 0,
        this.m.matrix[1][0], this.m.matrix[1][1], this.m.matrix[1][2], 0,
        this.m.matrix[2][0], this.m.matrix[2][1], this.m.matrix[2][2], 0,
        this.m.matrix[3][0], this.m.matrix[3][1], this.m.matrix[3][2], 1);
    }
  
    show() {
        push();

        // show Text
        this.turn();
        if (DEBUG) {
            fill(127, 127, 127);
            text("T", 0, 0);
        }

        //show coordinate system
        let c_len = 25;
        strokeWeight(3);
        stroke(255,0,0);
        line(0,0,0,c_len,0,0);
        stroke(0,255,0);
        line(0,0,0,0,c_len,0);
        stroke(0,0,255);
        line(0, 0, 0, 0, 0, c_len);
        this.marker.show();
        pop();
    }
}
  