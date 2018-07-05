Item = {}

Item.createItemRandom = function() {
  return (random(this.genreateFunc())());
}
//rotatePos: body will rotate with the rotate Pos, and it will change while the mouse moves
//tran: rotate Pos - hold Pos

Item.createStick = function(len) {
  let body = Bodies.rectangle(0, 0, len, 1, {
    isStatic: true,
  });
  let holdPos = {
    x: body.bounds.max.x,
    y: body.bounds.max.y,
  };
  let tran = {
    x: 0.5, 
    y: 0.5,
  }
  let rotatePos = Common.sub(holdPos, tran);

  let stick = {
    body: body,
    color: Color.brown,
    owner: undefined,
    label:{
      type: "safe",//danger, flag, animal, ground, lava
      shape: "polygon",
      displayType: "A",
      status: "select",
    },
    holdPos: holdPos,
    rotatePos: rotatePos,
    tran: tran,
    collisionCount: {
      "A": 0, 
      "B": 0,
      "C": 0,
      "D": 0,
    },
  }

  stick.running = function(){//event on beforeupdate!

  };
  stick.init = function(){

  };
  stick.rotate = function(){
    Matter.Body.rotate(this.body, Math.PI / 2, this.rotatePos);
  };
  stick.display = function(){
    
  }

  stick.select = function(holdPos){
    let newPos = {
      x: -this.holdPos.x + holdPos.x,
      y: -this.holdPos.y + holdPos.y,
    }
    Matter.Body.setPosition(this.body, newPos);
    this.rotatePos = Common.sub(holdPos, tran)
  }

  stick.body.label = stick;

  return stick;
}

Item.createRotatingBox = function(){
  let body = Bodies.rectangle(0, 0, 2, 2, { 
    isStatic: true,
  });
  let holdPos = {
    x: body.bounds.max.x,
    y: body.bounds.max.y,
  };
  let tran = {
    x: 0.5,
    y: 0.5,
  }
  let rotatePos = Common.sub(holdPos, tran);

  let box = {
    body: body,
    color: Color.darkBrown,
    owner: undefined,
    label: {
      type: "safe",//danger, flag, animal, ground, sticky
      shape: "polygon",
      displayType: "A",
      status: "select",
    },
    holdPos: holdPos,
    rotatePos: rotatePos,
    tran: tran,
    rotationFlag: 1,
    collisionCount: {
      "A": 0,
      "B": 0,
      "C": 0,
      "D": 0,
    },
  }
  box.running = function(){
    Matter.Body.rotate(this.body, 0.02*this.rotationFlag, this.body.position);
  }
  box.init = function(){
    Matter.Body.setAngle(this.body, 0);
  }
  box.rotate = function(){
    this.rotationFlag *= -1;
  }

  box.select = function (holdPos) {
    let newPos = {
      x: -this.holdPos.x + holdPos.x,
      y: -this.holdPos.y + holdPos.y,
    }
    Matter.Body.setPosition(this.body, newPos);
    this.rotatePos = Common.sub(holdPos, tran)
  }

  box.body.label = box;

  return box;
}

Item.createButter = function(){
  let body = Bodies.rectangle(0, 0, 1, 1, {
    isStatic: true,
    isSensor: true,
  });
  let holdPos = Common.sub(body.bounds.max, {x:0, y:0.5});
  let tran = {
    x: 0.5,
    y: 0.5,
  };
  let rotatePos = Common.sub(holdPos, tran);

  let butter = {
    body: body,
    color: Color.lightYellow,
    owner: undefined,
    label: {
      type: "sticky",//danger, flag, animal, ground, sticky
      shape: "polygon",
      displayType: "B",
      status: "select",
    },
    holdPos: holdPos,
    rotatePos: rotatePos,
    tran: tran,
    collisionCount: {
      "A": 0,
      "B": 0,
      "C": 0,
      "D": 0,
    },
  }

  butter.running = function () {//event on beforeupdate!

  };
  butter.init = function () {

  };
  butter.rotate = function () {
    Matter.Body.rotate(this.body, Math.PI / 2, this.rotatePos);
  };

  butter.body.label = butter;

  butter.select = function (holdPos) {
    let newPos = {
      x: -this.holdPos.x + holdPos.x,
      y: -this.holdPos.y + holdPos.y,
    }
    Matter.Body.setPosition(this.body, newPos);
    this.rotatePos = Common.sub(holdPos, tran);
  }


  return butter;
}

Item.genreateFunc = function(){
  return (
    [
      () => this.createStick(1),
      () => this.createStick(2),
      () => this.createStick(3),
      () => this.createStick(4),
      () => this.createRotatingBox(),
      () => this.createButter(),
    ]
  );
} 
