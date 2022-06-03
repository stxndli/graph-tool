class Vertex{
  constructor(x, y, index=0) {
    this.x = x;
    this.y = y;
    this.index = index
   }
   draw(ctx){
    ctx.font = "20px Arial";
    ctx.save()
   	ctx.beginPath();
    ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = "#36AE7C" //green
    ctx.fill()
    ctx.restore()
    ctx.fillText(this.index, this.x-6, this.y+6);
   }
   select(ctx, color){
   	  ctx.save()
      ctx.beginPath();
      ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = color
      ctx.fill()
      ctx.restore()
      ctx.fillText(this.index.toString(), this.x-6, this.y+6);
      
   }
   unselect(ctx){
    if(this.index!=-1){
        ctx.save()
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "#36AE7C"
        ctx.fill()
        ctx.restore()
        ctx.fillText(this.index.toString(), this.x-6, this.y+6);
      }
   }
}
class Edge{
  constructor(from, to, weight, isDirected) {
    this.from = from
    this.to = to
    this.weight = weight
    this.isDirected = isDirected
   }
  draw(ctx, color="#36AE7C", arrowWidth=2){
      //calculate where does the edge start and end relative to the position of the vertices
  	  let fromx, tox, fromy, toy
      if(Math.abs(this.from.x-this.to.x)<Math.abs(this.from.y-this.to.y)){
        fromx = this.from.x
        tox = this.to.x
        if(this.from.y<this.to.y){
          fromy = this.from.y+20
          toy = this.to.y-20
        }
        else{
          fromy = this.from.y-20
          toy = this.to.y+20
        }
      }
      else{
          fromy = this.from.y
          toy = this.to.y
          if(this.from.x<this.to.x){
            fromx = this.from.x+20
            tox = this.to.x-25
          }
          else{
            fromx = this.from.x-20
            tox = this.to.x+25
          }
      }
      var headlen = 10;
      var angle = Math.atan2(toy-fromy,tox-fromx);
 	  
      ctx.save();
      ctx.fillStyle = color
      ctx.strokeStyle = color;
   
      //starting path of the arrow from the start square to the end square
      //and drawing the stroke
      if(this.weight === null){
        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.lineWidth = arrowWidth;
        ctx.stroke();
      }
      else{
        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo((tox+fromx)/2, (toy+fromy)/2);
        ctx.lineWidth = arrowWidth;
        ctx.stroke()
        ctx.font = "15px Arial";
        ctx.fillStyle = "black"
        ctx.fillText(this.weight, (tox+fromx)/2+3, (toy+fromy)/2-3);
        ctx.fillStyle = color
        ctx.font = "20px Arial";
        ctx.beginPath();
        ctx.moveTo((tox+fromx)/2, (toy+fromy)/2);
        ctx.lineTo(tox, toy);
        ctx.lineWidth = arrowWidth;
        ctx.stroke()
      }
      if(this.isDirected){
            //starting a new path from the head of the arrow to one of the sides of
            //the point
            ctx.beginPath();
            ctx.moveTo(tox, toy);
            ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
                       toy-headlen*Math.sin(angle-Math.PI/7));
         
            //path from the side point of the arrow, to the other side point
            ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
                       toy-headlen*Math.sin(angle+Math.PI/7));
         
            //path from the side point back to the tip of the arrow, and then
            //again to the opposite side point
            ctx.lineTo(tox, toy);
            ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
                       toy-headlen*Math.sin(angle-Math.PI/7));
         
            //draws the paths created above
            ctx.stroke();
            ctx.restore();
        }
      ctx.restore();
    }
}
export {Vertex, Edge}