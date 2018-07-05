Grid = {}

Grid.create = function (pos) {
  let grid = {
    pos: pos,
    color: Color.black,
    w: 1,
    h: 1,
    label:{
      shape: "rect",
      type: "grid",
      isFilled: false,
    }
  }
  return grid;
}

Grids = {}

Grids.create = function (w, h, color){
  let grids = [];
  for (let i = 0; i != w; i++) {
    for (let j = 0; j != h; j++) {
      let pos = {
        x: i + 0.5,
        y: j + 0.5,
      }
      let grid = Grid.create(pos , color);
      grids.push(grid);
    }
  }
  return grids;
}