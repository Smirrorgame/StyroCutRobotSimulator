class Matrix {

  constructor(n1,n2,n3, o1,o2,o3, p1,p2,p3, t1,t2,t3) {
    this.matrix = [
      [n1, n2, n3, 0],
      [o1, o2, o3, 0],
      [p1, p2, p3, 0],
      [t1, t2, t3, 1]
    ];

  }

  // matrix homogennous row-wise
  set(pos) {
    let i = 1;
    if (pos.length < 13 || pos.length > 15) return false;
    // pos=-0.40568900 0.69745900 -0.59073500 174.51620000 -0.88539000 -0.46034700 0.06453000 -173.72230000 -0.22693600 0.54921000 0.80428100 -1831.04040000
    this.matrix[0][0] = parseFloat(pos[1]);
    this.matrix[1][0] = parseFloat(pos[2]);
    this.matrix[2][0] = parseFloat(pos[3]);
    this.matrix[3][0] = parseFloat(pos[4]);

    this.matrix[0][1] = parseFloat(pos[5]);
    this.matrix[1][1] = parseFloat(pos[6]);
    this.matrix[2][1] = parseFloat(pos[7]);
    this.matrix[3][1] = parseFloat(pos[8]);

    this.matrix[0][2] = parseFloat(pos[9]);
    this.matrix[1][2] = parseFloat(pos[10]);
    this.matrix[2][2] = parseFloat(pos[11]);
    this.matrix[3][2] = parseFloat(pos[12]);

    this.matrix[0][3] = 0;
    this.matrix[1][3] = 0;
    this.matrix[2][3] = 0;
    this.matrix[3][3] = 1;
    return true;
  }

  setmat(m) {
    for (let r = 0; r<m.length; r++) {
      for (let c = 0; c < m[0].length; c++){
        this.matrix[r][c] = m[r][c];
      }
    }
  }

  invert() {
    let rot_inv = this.getRotInv();
    let d = [[this.matrix[3][0]], [this.matrix[3][1]], [this.matrix[3][2]]];
    let d_new_neg = this.multV(Matrix.transpose(rot_inv).matrix, d);
    let r = rot_inv;
    r[0][3] = 0;
    r[1][3] = 0;
    r[2][3] = 0;
    r.push([0, 0, 0, 1]);
    r[3][0] = -d_new_neg[0][0];
    r[3][1] = -d_new_neg[1][0];
    r[3][2] = -d_new_neg[2][0];
    return r;
  }

  static mult(a, b) {
    let x = [];
    for (let row = 0; row < a.length; row++) {
      let y = [];
      for (let col = 0; col < b[0].length; col++) {
        let sum = 0;
        for (let k = 0; k < b.length; k++) {
          sum += a[row][k] * b[k][col];
        }
        y.push(sum);
      }
      x.push(y);
    }
    return x;
  }

  multV(m, v) {
    let x = [[0], [0], [0], [1]];
    
    for (let row = 0; row < m.length; row++) {
      for (let col = 0; col < v[0].length; col++) {
        let sum = 0;
        for (let k = 0; k < v.length; k++) {
          sum += m[row][k] * v[k][col];
        }
        x[row][col] = sum;
      }
    }
    return x;
  }

  getRotInv() {
    let t = Matrix.transpose(this.matrix).matrix;
    let n1 = t[0][0];
    let n2 = t[1][0];
    let n3 = t[2][0];

    let o1 = t[0][1];
    let o2 = t[1][1];
    let o3 = t[2][1];

    let p1 = t[0][2];
    let p2 = t[1][2];
    let p3 = t[2][2];
    return [[n1, o1, p1],
            [n2, o2, p2],
            [n3, o3, p3]];
  }

  static transpose(x) {
    if (!x) x = this.matrix;
    let t = [];
    for (let row = 0; row < x.length; row++) {
      let p = [];
      for (let col = 0; col < x[0].length; col++) {
        p.push(x[col][row]);
      }
    t.push(p);
    }
    let m = new Matrix(0,0,0,0,0,0,0,0,0,0,0,0);
    m.setmat(t);
    return m;
  }
}
