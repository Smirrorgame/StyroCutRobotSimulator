class Matrix {

  constructor(n1,n2,n3, o1,o2,o3, p1,p2,p3, x,y,z) {
    this.n1 = n1;
    this.n2 = n2;
    this.n3 = n3;

    this.o1 = o1;
    this.o2 = o2;
    this.o3 = o3;

    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;

    this.t1 = x;
    this.t2 = y;
    this.t3 = z;

    this.matrix = [
      [this.n1, this.n2, this.n3, 0],
      [this.o1, this.o2, this.o3, 0],
      [this.p1, this.p2, this.p3, 0],
      [this.t1, this.t2, this.t3, 1]
    ];

  }

  set(pos) {
    let i = 1;
    if(pos.length<13||pos.length>15) return false;
    this.n1 = parseFloat(pos[0+i]);
    this.n2 = parseFloat(pos[1+i]);
    this.n3 = parseFloat(pos[2+i]);

    this.o1 = parseFloat(pos[3+i]);
    this.o2 = parseFloat(pos[4+i]);
    this.o3 = parseFloat(pos[5+i]);

    this.p1 = parseFloat(pos[6+i]);
    this.p2 = parseFloat(pos[7+i]);
    this.p3 = parseFloat(pos[8+i]);

    this.t1 = parseFloat(pos[9+i]);
    this.t2 = parseFloat(pos[10+i]);
    this.t3 = parseFloat(pos[11+i]);
    return true;
  }


}
