Map = {}

Map.createFarm = function(){
  let h = 10;
  let w = 20;

  let grounds = [];
  let flag = Map.createFlag({
    x: 18,
    y: 9,
  })

  let ground = Map.createGround({
    x: 0,
    y: 9,
  }, {
    x: 20,
    y: 10,
  })
  grounds.push(ground);

  let startingRegion = Map.createRegion({
    x: 0, 
    y: 5,
  }, {
    x: 4,
    y: 9,
  })

  let finishingRegion = Map.createRegion({
    x: 16,
    y: 5,
  }, {
    x: 20,
    y: 9
  })

  let map = {
    w: w,
    h: h, 
    grounds: grounds,
    flag: flag,
    items: [],
    startingRegion: startingRegion,
    finishingRegion: finishingRegion,
  }

  return map;
}

Map.createGround = function(pos1, pos2, isSafe=true){
  let pos = {
    x: (pos1.x + pos2.x)/2,
    y: (pos1.y + pos2.y)/2,
  }
  let w = pos2.x - pos1.x;
  let h = pos2.y - pos1.y;
  let body = Bodies.rectangle(pos.x, pos.y, w, h, {
    isStatic: true,
  });
  let safeLabel = (isSafe)? "ground": "lava";
  let color = (isSafe)? Color.brown: Color.red;
  
  let rect = {
    body: body,
    color: color,
    label:{
      type: safeLabel,
      shape: "rect",
      displayType: "A",
      status: "run",
    },
    pos: pos,
    w: w,
    h: h, 
  }

  rect.body.label = rect;

  return rect;
}

Map.createRegion = function(pos1, pos2){
  let pos = {
    x: (pos1.x + pos2.x) / 2,
    y: (pos1.y + pos2.y) / 2,
  }
  let w = pos2.x - pos1.x;
  let h = pos2.y - pos1.y;
  let body = Bodies.rectangle(pos.x, pos.y, w, h, {
    isSensor: true,
    isStatic: true,
  });
  let color = Color.blue;

  let region = {
    body: body,
    color: color,
    label: {
      type: "region",
      shape: "rect",
      displayType: "C",
      status: "run",
    },
    pos: pos,
    w: w,
    h: h, 
  }

  region.displayPos = [{
      x: pos1.x+0.5,
      y: pos2.y-2,
    }, {
      x: pos1.x+1.5,
      y: pos2.y-2,
    }, {
      x: pos1.x+2.5,
      y: pos2.y-2,
    }, {
      x: pos1.x+3.5,
      y: pos2.y-2,
    }
  ]

  region.body.label = region;

  return region;
}

Map.createFlag = function(pos){
  pos = {
    x: pos.x + 0.5,
    y: pos.y -1,
  }
  let w = 1;
  let h = 2;
  let body = Bodies.rectangle(pos.x, pos.y, w, h, {
    isStatic: true,
    isSensor: true,
  });
  let color = Color.green;

  let flag = {
    body: body,
    color: color,
    label:{
      type: "flag",
      shape: "rect",
      displayType: "C",
      status: "run",
    },
    pos: pos,
    w: w,
    h: h,
  }

  flag.body.label = flag;

  return flag;
}