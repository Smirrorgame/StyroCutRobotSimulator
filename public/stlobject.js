class STLObject {

    constructor(n1,n2,n3, o1,o2,o3, p1,p2,p3, x,y,z) {
        this.coord = new CoordinateSystem(n1, n2, n3, o1, o2, o3, p1, p2, p3, x, y, z);
    }

    show() {
        push();
        //show coordinate system
        this.coord.turn();

        //show coordinate system
        let c_len = 25;
        strokeWeight(3);
        stroke(255,0,0);
        line(0,0,0,c_len,0,0);
        stroke(0,255,0);
        line(0,0,0,0,c_len,0);
        stroke(0,0,255);
        line(0, 0, 0, 0, 0, c_len);

        // show model
        fill(255);
        stroke(0);
        strokeWeight(0.5);
        beginShape();

        vertex(10.66, 10.66, 0);
        vertex(17, -13, 0);
        vertex(-6.66, -6.66, 0);

        vertex(10.66, 10.66, 0);
        vertex(-6.66, -6.66, 0);
        vertex(7, -3, 20);

        vertex(7, -3, 20);
        vertex(17, -13, 0);
        vertex(10.66, 10.66, 0);


        vertex(-6.66, -6.66, 0);
        vertex(17, -13, 0);
        vertex(7, -3, 20);
        endShape(CLOSE);
        
      

        pop();
    }
    
}