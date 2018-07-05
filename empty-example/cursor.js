class Cursor {
  constructor(pos, color, isControlled) {
    let radius = 0.5;
    let body = undefined;

    if(isControlled){
      body = Matter.Bodies.circle(pos.x, pos.y, 0.5, {
        isSensor: true,
        frictionAir: 0.2,
      });
      body.ignoreGravity = true;
      pos = body.position;
    }
    else{
    }

    this.body = body;
    this.color = color;
    this.label = {
      type: "cursor",//danger, flag, animal, ground, cursor
      shape: "circle",
      displayType: "D",
      status: "run",
    };
    this.pos = pos;//{ x: game.width / 2, y: game.height / 2 };
    this.radius = radius;
    this.hoverItem = undefined;
    this.holdItem = undefined;

    this.isDisplayable = false;

    this.body.label = this;
  }
  
  turn(direction, mode) {
    switch (mode) {
      case "selecting":

        let velocity = this.body.velocity;

        switch (direction) {
          case "right":
            Matter.Body.setVelocity(this.body, { x: 0.15, y: velocity.y });
            break;
          case "left":
            Matter.Body.setVelocity(this.body, { x: -0.15, y: velocity.y });
            break;
          case "up":
            Matter.Body.setVelocity(this.body, { x: velocity.x, y: -0.15 });
            break;
          case "down":
            Matter.Body.setVelocity(this.body, { x: velocity.x, y: 0.15 });
            break;
          default:
            console.log("error input");
        }
        break;

      case "displaying":

        switch (direction) {
          case "right":
            Matter.Body.setPosition(this.body, { x: this.pos.x + 1, y: this.pos.y });
            Matter.Body.setPosition(this.holdItem.body, { x: this.holdItem.body.position.x + 1, y: this.holdItem.body.position.y });
            this.holdItem.rotatePos = {
              x: this.holdItem.rotatePos.x + 1,
              y: this.holdItem.rotatePos.y,
            }
            break;
          case "left":
            Matter.Body.setPosition(this.body, { x: this.pos.x - 1, y: this.pos.y });
            Matter.Body.setPosition(this.holdItem.body, { x: this.holdItem.body.position.x - 1, y: this.holdItem.body.position.y });
            this.holdItem.rotatePos = {
              x: this.holdItem.rotatePos.x - 1,
              y: this.holdItem.rotatePos.y,
            }
            break;
          case "up":
            Matter.Body.setPosition(this.body, { x: this.pos.x, y: this.pos.y - 1 });
            Matter.Body.setPosition(this.holdItem.body, { x: this.holdItem.body.position.x, y: this.holdItem.body.position.y - 1 });
            this.holdItem.rotatePos = {
              x: this.holdItem.rotatePos.x,
              y: this.holdItem.rotatePos.y - 1,
            }
            break;
          case "down":
            Matter.Body.setPosition(this.body, { x: this.pos.x, y: this.pos.y + 1 });
            Matter.Body.setPosition(this.holdItem.body, { x: this.holdItem.body.position.x, y: this.holdItem.body.position.y + 1 });
            this.holdItem.rotatePos = {
              x: this.holdItem.rotatePos.x,
              y: this.holdItem.rotatePos.y + 1,
            }
            break;
          default:
            console.log("error input");
        }
        break;
    }
  }

  select() {
    if (this.hoverItem !== undefined) {
      this.holdItem = this.hoverItem;
      this.hoverItem = undefined;

      this.holdItem.owner = this;
      this.holdItem.strokeColor = Color.black;
      this.holdItem.label.status = "display";

      Matter.Body.setVelocity(this.body, {
        x: 0,
        y: 0,
      });
      Matter.Body.setPosition(this.body, {
        x: Math.floor(this.body.position.x) + 1 / 2,
        y: Math.floor(this.body.position.y) + 1 / 2,
      });

      let holdPos = this.body.bounds.min;

      this.holdItem.select(holdPos);

      Matter.Body.scale(this.holdItem.body, 0.9, 0.9);

      return true;
    }

    return false;
  }

  display() {
    if (this.displayIsValid) {
      return true;
    }
    return false;
  }

  init(){
    this.hoverItem = undefined;
    this.holdItem = undefined;

    this.isDisplayable = false;

    this.body.label = this;
  }
}