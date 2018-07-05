class Draw{
  constructor(drawParams){
    this.drawParams = drawParams;
  }
  
  show(token) {
    let s = this.drawParams.scale;
    let displacement = this.drawParams.displacement;
    let shape = token.label.shape;
    let c = color(token.color);
    let isFilled = token.label.hasOwnProperty("isFilled")? token.label.isFilled: true;
    let sc = token.strokeColor || 0;
    
    if (shape == "rect") {
      let pos = token.pos;
      let w = token.w;
      let h = token.h;
      push();
      scale(s)
      translate(pos.x, pos.y)
      rectMode(CENTER);
      translate(displacement.x, displacement.y);
      (isFilled)? fill(c): noFill();
      stroke(sc);
      strokeWeight(1/s)
      rect(0, 0, w, h);
      pop();
    }
    else if (shape == "circle") {
      let pos = token.pos;
      let radius = token.radius;
      push();
      scale(s)
      translate(pos.x, pos.y);
      (isFilled) ? fill(c) : noFill();
      stroke(sc);
      strokeWeight(1 / s)
      translate(displacement.x, displacement.y);
      ellipseMode(RADIUS);
      ellipse(0, 0, radius, radius);
      pop();
    }
    else if (shape == "polygon") {
      let vertices = token.body.vertices;
      push();
      scale(s);
      (isFilled) ? fill(c) : noFill();
      stroke(sc);
      strokeWeight(1 / s)
      translate(displacement.x, displacement.y);
      beginShape();
      for (let i = 0; i != vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
      }
      endShape(CLOSE);
      pop();
    }
  }
}

