import Konva from 'konva'
class Vertex{
  #circle
  #group
  constructor(x, y, index=0) {
    this.x = x;
    this.y = y;
    this.index = index
    this.i = new Konva.Text()
    this.#circle = new Konva.Circle({
      x: 0,
      y: 0,
      radius: 20,
      fill:"#36AE7C",
      stroke: 'black',
      strokeWidth: 4
    })
    this.#group = new Konva.Group({
      x: this.x,
      y: this.y
    })
   }
   draw(stage,layer){
    const text = new Konva.Text({
        x: 0,
        y: 0,
        text: this.index.toString(),
        fontSize: 20,
        fontFamily: 'Arial',
        fill: 'black',
    })
    text.offsetX(text.width() / 2);
    text.offsetY(text.height() / 2);
    // add the shape to the layer

    this.#group.add(this.#circle);
    this.#group.add(text)
    layer.add(this.#group)

    // add the layer to the stage
    stage.add(layer);

    // draw the image
    layer.draw();

   }
   info(t){
     this.i = new Konva.Text({
         x: 0,
         y: -30,
         text: t.toString(),
         fontSize: 16,
         fontFamily: 'Arial',
         fill: 'black',
     })
     this.i.offsetX(this.i.width() / 2);
     this.i.offsetY(this.i.height() / 2);
     this.#group.add(this.i)
   }
   destroyInfo(){
     this.i.destroy()
   }
   startDrag(){
    this.#group.draggable(true)
   }
   getGroup(){
    return this.#group
   }
   stopDrag(){
    this.#group.draggable(false)
   }
   getCoords(){
     return {x:this.#group.x(),y:this.#group.y()}
   }
   select(color){
   	  this.#circle.fill(color)
   }
   unselect(){
    if(this.index!=-1){
        this.#circle.fill("#36AE7C")
      }
   }
   destroy(){
    this.#group.destroy()
   }
}
class Edge{
  constructor(from, to, weight, isDirected) {
    this.from = from
    this.to = to
    this.weight = weight
    this.isDirected = isDirected
    this.arrow = null
    this.points = []
   }
  draw(stage, layer, color="#36AE7C", arrowWidth=2){
      //calculate where does the edge start and end relative to the position of vertices
  	  if(this.points.length==0){this.points = this.calculatePoints(this.from,this.to)}
      this.arrow = new Konva.Arrow({
              points: this.points, // [x1, y1, x2, y2].
              pointerLength: 10,
              pointerWidth: 10,
              fill: color,
              stroke: color,
              strokeWidth: 4,
              })
      layer.add(this.arrow);

      // add the layer to the stage
      stage.add(layer);
      return this.points
    }
  calculatePoints(from,to){
    let fromx, tox, fromy, toy
    if(Math.abs(from.x-to.x)<Math.abs(from.y-to.y)){
        fromx = from.x
        tox = to.x
        if(from.y<to.y){
          fromy = from.y+20
          toy = to.y-20
        }
        else{
          fromy = from.y-20
          toy = to.y+20
        }
      }
      else{
          fromy = from.y
          toy = to.y
          if(from.x<to.x){
            fromx = from.x+20
            tox = to.x-25
          }
          else{
            fromx = from.x-20
            tox = to.x+25
          }
      }
      return [fromx, fromy, tox, toy]
  }
  destroy(){
    if(this.arrow!=null){
        this.arrow.remove()}
  }
}
export {Vertex, Edge}
