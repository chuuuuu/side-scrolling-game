let Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies;

let game; 

function setup() {
  createCanvas(window.innerWidth, window.innerHeight)
  game = new Game();
}

function draw(){
  background(155);
  game.show();
}

