class STLObject {



    constructor(n1,n2,n3, o1,o2,o3, p1,p2,p3, x,y,z) {
        this.coord = new CoordinateSystem(n1, n2, n3, o1, o2, o3, p1, p2, p3, x, y, z);
        this.marker = new CoordinateSystem(-1, 0, 0, 0, 1, 0, 0, 0, -1, -50, -100, 40);
        this.effectorToMarker = new Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 10);
        this.update(this.effectorToMarker);
    }

    update(m) {
        let x = this.effectorToMarker;
        let y_inv = this.coord.m.invert();
        let tmp = Matrix.mult(x.matrix, m.matrix);
        let tmp2 = Matrix.mult(tmp, y_inv);
        let n = new Matrix(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        
        n.setmat(tmp2);
        
        n.matrix[3][0] = 0;
        n.matrix[3][1] = 0;
        n.matrix[3][2] = 0;


        //#########################################
        //creating phases for noise for each possible rotation in the range of 1 degree
        let alpha_x = ((0.5 - random()) * 2) * PI / 360;
		let beta_y = ((0.5-random())*2)*PI/360;
		let gamma_z = ((0.5-random())*2)*PI/360;
                
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
        let z = new Matrix(a11, a12, a13, a21, a22, a23, a31, a32, a33, 0, 0, 0).matrix;
        n.setmat(Matrix.mult(n.matrix,z));
        
        n.matrix[3][0] = tmp2[3][0] + ((0.5 - random()) * 2);
        n.matrix[3][1] = tmp2[3][1] + ((0.5 - random()) * 2);
        n.matrix[3][2] = tmp2[3][2] + ((0.5 - random()) * 2);

        this.marker.m.setmat(n.matrix);
    }

    show() {
        push();
        this.coord.turn();
        fill(255);
        stroke(0);
        beginShape();
        
        vertex(7, -3, 20);
        vertex(17, -13, 0);
        vertex(10.66, 10.66, 0);

        vertex(10.66, 10.66, 0);
        vertex(17, -13, 0);
        vertex(-6.66, -6.66, 0);


        vertex(-6.66, -6.66, 0);
        vertex(17, -13, 0);
        vertex(7, -3, 20);
        
        vertex(10.66, 10.66, 0);
        vertex(-6.66, -6.66, 0);
        vertex(7, -3, 20);

        endShape(CLOSE);

        this.marker.disp(false);

        pop();
        this.coord.disp(false);
    }
    
}