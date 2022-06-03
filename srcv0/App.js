import './App.css';
import Canvas, {drawGrid} from './Canvas'
import Konva from 'konva'
import React, {useState, useEffect} from 'react'
import {Vertex, Edge} from './Classes'
import {BFS, DFS} from './Algorithms'
import InfiniteCanvas from 'ef-infinite-canvas'
function App() {
  
  const [canvasHeight, setCanvasHeight] = useState(0)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const [ctx, setCtx] = useState()
  useEffect(()=>{
    const canvas = document.getElementById("canvas")
    const c = canvas.getContext('2d') 
    setCanvasHeight(canvas.height)
    setCanvasWidth(canvas.width)
    setCtx(c)
    drawGrid(canvasHeight, canvasWidth, c)
    var stage = new Konva.Stage({
        container: 'container',   // id of container <div>
        width: 500,
        height: 500
    });
  }, [])
  const [vertexID, setVertexID] = useState(0)
  const [vertices, setVertices] = useState([])
  const [edges, setEdges] = useState([])
  const [weight, setWeight] = useState(null)
  const [isDirected, setIsDirected] = useState(false)
  const [graph, setGraph] = useState({})
  const [dragX, setDragX] = useState()
  const [dragY, setDragY] = useState()
  const [isDrag, setIsDrag] = useState(false)
  useEffect(()=>{
    //update the graph
    let g = {...graph}
    vertices.forEach(vertex=>{
      if(g[JSON.stringify(vertex)] === undefined){
        g[JSON.stringify(vertex)] = []
      }
      edges.forEach(edge=>{
        if(vertex.x == edge.from.x && vertex.y == edge.from.y && !g[JSON.stringify(vertex)].includes(JSON.stringify(new Vertex(edge.to.x, edge.to.y, edge.to.index)))){
            g[JSON.stringify(vertex)].push(JSON.stringify(new Vertex(edge.to.x, edge.to.y, edge.to.index)))
        }
      })
    })
    setGraph(g)
  },[vertices, edges])
  useEffect(
    () => {
      if(isDrag){
            const update = (e) => {
              setDragX(e.x)
              setDragY(e.y)
              ctx.clearRect(0, 0, canvasWidth, canvasHeight);
              drawGrid(canvasHeight, canvasWidth, ctx)
            }
            window.addEventListener('mousemove', update)
            window.addEventListener('touchmove', update)
            return () => {
              window.removeEventListener('mousemove', update)
              window.removeEventListener('touchmove', update)
            }
          }},
    [setDragX, setDragY, isDrag]
  )
  const [edgeStart, setEdgeStart] = useState(false)

  // user picked delete tool
  const [op, setOp] = useState("vertex")

  // coordinates to the start of an edge [fromX, fromY]
  const [edge, setEdge] = useState([])

  // coordinates to a selected vertex
  const [selected, setSelected] = useState(new Vertex(-1,-1,-1))

  const drawLine = (x,y)=>{
    if(edgeStart==false){
        setEdge([x,y])
        setEdgeStart(true)        
      }
    else{
      setEdgeStart(false)
      //update list of edges
      let from, to
      from = vertices.find(vertex=>vertex.x === edge[0] && vertex.y === edge[1])
      to = vertices.find(vertex=>vertex.x === x && vertex.y === y)
      const e = new Edge(from, to, weight, isDirected)
      setEdges((prevEdges)=>[...prevEdges,e])
      if(!isDirected){
        const n = new Edge(to, from, weight, isDirected)
        setEdges((prevEdges)=>[...prevEdges,n])
      }
      e.draw(ctx)
      console.log(graph)
    }
  }
  const handleDelete = (vertex)=>{
    const e = edges.filter(element=>element.from!=vertex&&element.to!=vertex)
    const v = vertices.filter(element=>element.index!==vertex.index)
    let g = {...graph}
    delete g[JSON.stringify(vertex)]
    setGraph(g)
    setEdges(e)
    setVertices(v)
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawGrid(canvasHeight, canvasWidth, ctx)
    e.forEach(edge=>{edge.draw(ctx)})
    v.forEach(vertex=>{vertex.draw(ctx)})
  }
  const handleClick = (event)=>{
    const x = event.nativeEvent.offsetX
    const y = event.nativeEvent.offsetY
    let draw = true
    vertices.forEach((vertex)=>{
      // prevent draw if resulting vertex intersect with an already existing one
      let distSq = (x - vertex.x) * (x - vertex.x) +
                     (y - vertex.y) * (y - vertex.y);
      let radSumSq = 1600; // (20 + 20) * (20 + 20) where 20 is the radius
      if (distSq <= radSumSq)
          draw = false
      //check if clicked on a vertex
      if(Math.sqrt((x-vertex.x) ** 2 + (y - vertex.y) ** 2) < 20){ // 20 is the radius of the circle

        selected.unselect(ctx)
        if(op!=="vertex" && vertex.index != selected.index && selected.index===-1){
          const v = new Vertex(vertex.x, vertex.y, vertex.index)
              setSelected(v)
              v.select(ctx, "#2155CD") //blue
          }
        else{
            setSelected(new Vertex(-1,-1,-1))
        }


        if(op==="delete"){
          setSelected(new Vertex(-1,-1,-1))
          handleDelete(vertex)
        }
        else if(op==="edge"){
            drawLine(vertex.x, vertex.y)
          }
        else if (op === "BFS"){
            vertex.unselect(ctx)
            setSelected(new Vertex(-1,-1,-1))
            setEdgeStart(false)
            BFS(graph, JSON.stringify(vertex), ctx)
        }
        else if (op === "DFS"){
            vertex.unselect(ctx)
            setSelected(new Vertex(-1,-1,-1))
            setEdgeStart(false)
            DFS(graph, JSON.stringify(vertex), ctx)
        }
        draw = false
      }
    })
    if(draw && op==="vertex"){
      selected.unselect(ctx)
      setSelected(new Vertex(-1,-1,-1))
      setEdgeStart(false)
      const vertex = new Vertex(x,y,vertexID)
      setVertexID(prevID=>prevID+1)
      vertex.draw(ctx)
      setVertices((prevVertices)=>[...prevVertices,vertex])
  }
}
  const handleOps = (e)=>{
    setOp(e.target.value)
  }
  const handleEvent = (e)=>{
     if (e.type === "mousedown") {
          setIsDrag(true)
          const x = e.nativeEvent.offsetX
          const y = e.nativeEvent.offsetY
          vertices.forEach((vertex)=>{
            if(Math.sqrt((x-vertex.x) ** 2 + (y - vertex.y) ** 2) < 20){ // 20 is the radius of the circle
              const toDrag = new Vertex(vertex.x,vertex.y,vertex.index)
            }
        })
      } else {
          setIsDrag(false)
      }
  }
  return (
    <div>
    <br/><br/><div className="btn-group" role="group">
      <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" value="delete" onChange={handleOps}/>
      <label className="btn btn-outline-danger" htmlFor="btnradio1">Delete</label>

      <input type="radio" className="btn-check" name="btnradio" id="btnradio2" value="edge" onChange={handleOps} autoComplete="off"/>
      <label className="btn btn-outline-primary" htmlFor="btnradio2">Add Edge</label>

      <input type="radio" className="btn-check" name="btnradio" id="btnradio3" value="vertex" onChange={handleOps} autoComplete="off" checked={op==="vertex"}/>
      <label className="btn btn-outline-primary" htmlFor="btnradio3">Add Vertex</label>

      <input type="radio" className="btn-check" name="btnradio" id="btnradio4" value="BFS" onChange={handleOps} autoComplete="off"/>
      <label className="btn btn-outline-primary" htmlFor="btnradio4">Breadth First Search</label>

      <input type="radio" className="btn-check" name="btnradio" id="btnradio5" value="DFS" onChange={handleOps} autoComplete="off"/>
      <label className="btn btn-outline-primary" htmlFor="btnradio5">Depth First Search</label>

      <input type="radio" className="btn-check" name="btnradio" id="btnradio6" value="Move" onChange={handleOps} autoComplete="off"/>
      <label className="btn btn-outline-primary" htmlFor="btnradio6">Move</label>
    </div>
    <br/><br/><center>
    <Canvas  handleClick={handleClick} onMouseDown={ handleEvent } onMouseUp={ handleEvent }/>
    </center>
    </div>
  );
}

export default App;
