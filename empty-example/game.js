class Game {
  constructor() {
    this.drawParams = {
      scale: 40,
      displacement: {
        x: 0,
        y: 0,
      }
    }

    this.keys = {
      up: 38,
      right: 39,
      down: 40,
      left: 37,
      q: 81,
      z: 90,
    };

    this.engine = Engine.create();
    Engine.run(this.engine);
    this.world = this.engine.world;
    this.world.gravity.y = 0.05;

    this.draw = new Draw(this.drawParams);

    this.map = Map.createFarm();

    this.grounds = this.map.grounds;
    this.grounds.forEach((ground) => {
      Matter.World.addBody(this.world, ground.body);
    })
    this.flag = this.map.flag;
    Matter.World.addBody(this.world, this.flag.body);
    this.items = this.map.items;
    this.items.forEach((item)=>{
      Matter.World.addBody(this.world, item.body);
    });
    this.startingRegion = this.map.startingRegion;
    Matter.World.addBody(this.world, this.startingRegion.body);
    this.finishingRegion = this.map.finishingRegion;
    Matter.World.addBody(this.world, this.finishingRegion.body);

    this.menu = new Menu(this.transformation({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }, true), 
      window.innerHeight / 1.5 / this.drawParams.scale, 
      window.innerHeight / 1.5 / this.drawParams.scale);
    this.cursor = new Cursor(this.transformation({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }, true), Color.white, true);
    Matter.World.addBody(this.world, this.cursor.body);

    this.controlAnimal = new Animal(this.startingRegion.displayPos[2], Color.white, true);
    Matter.World.addBody(this.world, this.controlAnimal.body);

    this.socketAnimals = [];

    this.grids = Grids.create(this.map.w, this.map.h, Color.white);

    this.displayingEvent = this.displayingEvent.bind(this);
    this.runningMatterCollisionStartEvent = this.runningMatterCollisionStartEvent.bind(this);
    this.runningMatterCollisionEndEvent = this.runningMatterCollisionEndEvent.bind(this);
    this.runningMatterBeforeUpdateEvent = this.runningMatterBeforeUpdateEvent.bind(this);

    this.selectingWillMount();

    console.log(this.stage);
  }

  //normal: map to display, inverse: display to map 
  transformation(pos, inverse = false) {
    let scale = this.drawParams.scale;
    let displacement = this.drawParams.displacement;
    if (inverse) {
      return ({
        x: pos.x / scale - displacement.x,
        y: pos.y / scale - displacement.y,
      })
    }

    return ({
      x: (pos.x + displacement.x) * scale,
      y: (pos.y + displacement.y) * scale,
    })
  }

  show() {
    switch (this.stage) {
      case "selecting":
        this.selectingUpdate();
        this.grids.forEach(grid => {
          this.draw.show(grid);
        })

        this.draw.show(this.startingRegion);
        this.draw.show(this.finishingRegion);
        this.grounds.forEach(ground => {
          this.draw.show(ground);
        });
        this.draw.show(this.flag);
        this.items.forEach(item => {
          this.draw.show(item);
        })
        this.draw.show(this.menu);
        this.menu.items.forEach(item => {
          this.draw.show(item)
        })
        this.draw.show(this.cursor);
        break;
      case "displaying":
        this.grids.forEach(grid => {
          this.draw.show(grid);
        })
        this.draw.show(this.startingRegion);
        this.draw.show(this.finishingRegion);
        this.grounds.forEach(ground => {
          this.draw.show(ground);
        });
        this.draw.show(this.flag);
        this.items.forEach(item => {
          this.draw.show(item);
        })
        this.draw.show(this.cursor);
        this.draw.show(this.cursor.holdItem);
        break;
      case "running":
        this.runningUpdate();
        this.draw.show(this.startingRegion);
        this.draw.show(this.finishingRegion);
        this.grounds.forEach(ground => {
          this.draw.show(ground);
        });
        this.draw.show(this.flag);
        this.items.forEach(item => {
          this.draw.show(item);
        })
        this.socketAnimals.forEach(animal => {
          this.draw.show(animal);
        })
        this.draw.show(this.controlAnimal);
        break;
    }
  }

  selectingWillMount() {
    this.stage = "selecting";
    this.menu.selectingWillMount();
    this.menu.items.forEach((item)=>{
      Matter.World.addBody(this.world, item.body);
    });
    Matter.Body.setPosition(this.cursor.body, this.transformation({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }, true));
    Matter.Events.on(this.engine, "collisionStart", this.selectingMatterCollisionStartEvent);
    Matter.Events.on(this.engine, "collisionEnd", this.selectingMatterCollisionEndEvent);
    this.cursor.init();
  }
  displayingWillMount() {
    this.stage = "displaying";
    document.addEventListener("keydown", this.displayingEvent);
  }
  runningWillMount() {
    this.stage = "running";
    document.addEventListener("keydown", this.runningEvent);
    Matter.Events.on(this.engine, "collisionStart", this.runningMatterCollisionStartEvent);
    Matter.Events.on(this.engine, "collisionEnd", this.runningMatterCollisionEndEvent);
    Matter.Events.on(this.engine, "beforeUpdate", this.runningMatterBeforeUpdateEvent);
    // document
  }

  //stage will unmount function
  selectingWillUnmount() {
    this.stage = "";
    setTimeout(() => { this.displayingWillMount(); }, 300);
    //add animation
    //delete remaining items
    this.menu.items.forEach((item)=>{
      if(item.label.status == "select"){
        Matter.Composite.remove(this.world, item.body, false);
      }
    })
    Matter.Events.off(this.engine, "collisionStart", this.selectingMatterCollisionStartEvent);
    Matter.Events.off(this.engine, "collisionEnd", this.selectingMatterCollisionEndEvent);
  }
  displayingWillUnmount() {
    this.stage = "";
    setTimeout(() => { this.runningWillMount(); }, 300);
    document.removeEventListener("keydown", this.displayingEvent);
    Matter.Body.setPosition(this.controlAnimal.body, this.startingRegion.displayPos[2]);
    this.controlAnimal.init();
  }
  runningWillUnmount() {
    this.stage = "";
    setTimeout(() => { this.selectingWillMount(); }, 300);
    Matter.Events.off(this.engine, "collisionStart", this.runningMatterCollisionStartEvent);
    Matter.Events.off(this.engine, "collisionEnd", this.runningMatterCollisionEndEvent);
    Matter.Events.off(this.engine, "beforeUpdate", this.runningMatterBeforeUpdateEvent);
    this.items.forEach((item) => {
      item.init();
    })
  }

  selectingUpdate(){
    if(keyIsDown(this.keys.left)){
      this.cursor.turn("left", "selecting");
    }
      
    if(keyIsDown(this.keys.right)){
      this.cursor.turn("right", "selecting");
    }
      
    if(keyIsDown(this.keys.up)){
      this.cursor.turn("up", "selecting");
    }
      
    if(keyIsDown(this.keys.down)){
      this.cursor.turn("down", "selecting");        
    }
    if(keyIsDown(this.keys.z)){
      if(this.cursor.select()){
        this.selectingWillUnmount();
      } 
    } 
  }

  selectingMatterCollisionStartEvent(e){
    e.pairs.forEach((pair) => {
      let tokenA = pair.bodyA.label;
      let tokenB = pair.bodyB.label;
      switch (tokenA.label.type) {
        case "cursor":
          if (tokenB.label.status == "select") {
            tokenA.hoverItem = tokenB;
            tokenB.strokeColor = Color.white;
            return;
          }
      }
      switch (tokenB.label.type) {
        case "cursor":
          if (tokenA.label.status == "select") {
            tokenB.hoverItem = tokenA;
            tokenA.strokeColor = Color.white;
            return;
          }
      }
    })
  }

  selectingMatterCollisionEndEvent(e){
    e.pairs.forEach((pair) => {
      let tokenA = pair.bodyA.label;
      let tokenB = pair.bodyB.label;
      switch (tokenA.label.type) {
        case "cursor":
          if (tokenB.label.status == "select") {
            tokenA.hoverItem = undefined;
            tokenB.strokeColor = Color.black;
            return;
          }
      }
      switch (tokenB.label.type) {
        case "cursor":
          if (tokenA.label.status == "select") {
            tokenB.hoverItem = undefined;
            tokenA.strokeColor = Color.white;
            return;
          }
      }
    })
  }

  displayingEvent(e){
    switch(e.keyCode){
      case this.keys.left:
        this.cursor.turn("left", "displaying");
        break;
      case this.keys.right:
        this.cursor.turn("right", "displaying");
        break;
      case this.keys.up:
        this.cursor.turn("up", "displaying");
        break;

      case this.keys.down:
        this.cursor.turn("down", "displaying");
        break;
      case this.keys.q: 
        this.cursor.holdItem.rotate();
        break;
      case this.keys.z:
        if(this.cursor.isDisplayable){
          this.items.push(this.cursor.holdItem);
          this.displayingWillUnmount();
        }
    }
    this.cursor.holdItem.collisionCount["A"] = 0;
    this.cursor.holdItem.collisionCount["B"] = 0;
    this.cursor.holdItem.collisionCount["C"] = 0;
    this.cursor.holdItem.collisionCount["D"] = 0;
    this.world.bodies.forEach((body) => {
      if(body !== this.cursor.holdItem.body){
        if(Matter.SAT.collides(body, this.cursor.holdItem.body).collided){
          this.cursor.holdItem.collisionCount[body.label.label.displayType]++;
        }
      }
    })

    switch(this.cursor.holdItem.label.displayType){
      case "A":
        if(this.cursor.holdItem.collisionCount["A"] != 0){
          this.cursor.isDisplayable = false;
          this.cursor.holdItem.strokeColor = Color.red;
          return;
        }
        if (this.cursor.holdItem.collisionCount["C"] != 0) {
          this.cursor.isDisplayable = false;
          this.cursor.holdItem.strokeColor = Color.red;
          return;
        }
        if (this.cursor.holdItem.collisionCount["D"] != 0) {
          this.cursor.isDisplayable = false;
          this.cursor.holdItem.strokeColor = Color.red;
          return;
        }
        this.cursor.isDisplayable = true;
        this.cursor.holdItem.strokeColor = Color.black;
        return;

      case "B":
        if (this.cursor.holdItem.collisionCount["A"] == 0) {
          this.cursor.isDisplayable = false;
          this.cursor.holdItem.strokeColor = Color.red;
          return;
        }
        if (this.cursor.holdItem.collisionCount["B"] != 0) {
          this.cursor.isDisplayable = false;
          this.cursor.holdItem.strokeColor = Color.red;
          return;
        }
        if (this.cursor.holdItem.collisionCount["C"] != 0) {
          this.cursor.isDisplayable = false;
          this.cursor.holdItem.strokeColor = Color.red;
          return;
        }
        if (this.cursor.holdItem.collisionCount["D"] != 0) {
          this.cursor.isDisplayable = false;
          this.cursor.holdItem.strokeColor = Color.red;
          return;
        }
        this.cursor.isDisplayable = true;
        this.cursor.holdItem.strokeColor = Color.black;
        return;
    }
  }

  runningUpdate(){
    if (keyIsDown(this.keys.left)) {
      this.controlAnimal.turn("left");
    }

    if (keyIsDown(this.keys.right)) {
      this.controlAnimal.turn("right");
    }

    if (keyIsDown(this.keys.up)) {
      this.controlAnimal.turn("up");
    }

    if (keyIsDown(this.keys.down)) {
      this.controlAnimal.turn("down");
    }
  }

  runningMatterCollisionStartEvent(e) {
    e.pairs.forEach((pair) => {
      let tokenA = pair.bodyA.label;
      let tokenB = pair.bodyB.label;
      switch (tokenA.label.type) {
        case "controlledAnimal":
          if (tokenB.label.type == "flag") {
            this.runningWillUnmount();
            return;
          }
          if (tokenB.label.type == "sticky") {
            tokenA.body.frictionAir = 0.5;
          }
          if (tokenB.label.type == "ground" || tokenB.label.type == "safe") {
            tokenA.isJumpable = true;
          }
      }
      switch (tokenB.label.type) {
        case "controlledAnimal":
          if (tokenA.label.type == "flag") {
            this.runningWillUnmount();
            return;
          }
          if (tokenA.label.type == "sticky") {
            tokenB.body.frictionAir = 0.5;
          }
          if (tokenA.label.type == "ground" || tokenB.label.type == "safe") {
            tokenB.isJumpable = true;
          }
      }
    })
  }

  runningMatterCollisionEndEvent(e) {
    e.pairs.forEach((pair) => {
      let tokenA = pair.bodyA.label;
      let tokenB = pair.bodyB.label;
      switch (tokenA.label.type) {
        case "controlledAnimal":
          if (tokenB.label.type == "flag") {
            this.runningWillUnmount();
            return;
          }
          if (tokenB.label.type == "sticky") {
            tokenA.body.frictionAir = 0.01;
          }
          if (tokenB.label.type == "ground" || tokenB.label.type == "safe") {
            tokenA.isJumpable = false;
          }
      }
      switch (tokenB.label.type) {
        case "controlledAnimal":
          if (tokenA.label.type == "flag") {
            this.runningWillUnmount();
            return;
          }
          if (tokenA.label.type == "sticky") {
            tokenB.body.frictionAir = 0.01;
          }
          if (tokenA.label.type == "ground" || tokenB.label.type == "safe") {
            tokenB.isJumpable = false;
          }
      }
    })
  }

  runningMatterBeforeUpdateEvent(e){
    this.items.forEach((item)=>{
      item.running();
    })
  }
}

//stage will mount function
