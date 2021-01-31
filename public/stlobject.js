class STLObject {



    constructor(n1,n2,n3, o1,o2,o3, p1,p2,p3, x,y,z) {
        this.coord = new CoordinateSystem(n1,n2,n3, o1,o2,o3, p1,p2,p3, x,y,z);
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
        pop();
    }
    
}