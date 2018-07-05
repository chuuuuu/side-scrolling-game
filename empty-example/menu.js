class Menu{
  constructor(pos, w, h) {
    this.pos = pos;
    this.w = w;
    this.h = h;
    this.color = Color.yellow;
    this.label = {
      type: "menu",
      shape: "rect",
    }
    this.displayPos = [
      {
        x: pos.x - w / 4,
        y: pos.y - h / 4,
      }, {
        x: pos.x - w / 4,
        y: pos.y + h / 4,
      }, {
        x: pos.x + w / 4,
        y: pos.y - h / 4,
      }, {
        x: pos.x + w / 4,
        y: pos.y + h / 4,
      }
    ]

    this.items = [];
  }

  selectingWillMount() {
    this.items = [];
    let item;

    item = Item.createItemRandom();
    this.items.push(item);
    Matter.Body.setPosition(item.body, this.displayPos[0]);

    item = Item.createItemRandom();
    this.items.push(item);
    Matter.Body.setPosition(item.body, this.displayPos[1]);

    item = Item.createItemRandom();
    this.items.push(item);
    Matter.Body.setPosition(item.body, this.displayPos[2]);

    item = Item.createItemRandom();
    this.items.push(item);
    Matter.Body.setPosition(item.body, this.displayPos[3]);

    return this.items;
  }
}

