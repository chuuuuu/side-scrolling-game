class Animal{
  constructor(pos, color, isControlled){
    let w = 1;
    let h = 2;
    let body = undefined;

    if (isControlled) {
      body = Bodies.rectangle(pos.x + w / 2, pos.y + h / 2, w, h, {
        frictionAir: 0.01,
      });
      Matter.Body.setInertia(body, Infinity);
      pos = body.position;
    }
    else {

    }

    this.body = body;
    this.color = color;
    this.label = {
      type: "controlledAnimal",//danger, flag, animal, ground, cursor
      shape: "rect",
      status: "run",
      displayType: "D",
    };
    this.pos = pos;
    this.w = w;
    this.h = h;
    this.initPos = pos;
    this.isJumpable = true;

    this.body.label = this;
  }

  turn(direction){
    switch(direction){
      case "right":
        Matter.Body.setVelocity(this.body, { x: 0.15, y: this.body.velocity.y })
        break;
      case "left":
        Matter.Body.setVelocity(this.body, { x: -0.15, y: this.body.velocity.y })
        break;
      case "up":
        if (this.isJumpable) {
          Matter.Body.setVelocity(this.body, {
            x: this.body.velocity.x,
            y: -0.3
          })
        }
        break;
      case "down":

    }    
  }
  
  init(){
    this.isJumpable = true;
  }
}