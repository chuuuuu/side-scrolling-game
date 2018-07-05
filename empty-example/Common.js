class Common{  

}

Common.add = function(vec1, vec2){
  return{
    x: vec1.x + vec2.x,
    y: vec1.y + vec2.y,
  }
}

Common.multi = function(vec, multiplier){
  return{
    x: vec.x * multiplier,
    y: vec.y * multiplier,
  }
}

Common.sub = function(vec1, vec2){
  return{
    x: vec1.x - vec2.x,
    y: vec1.y - vec2.y,
  }
}
