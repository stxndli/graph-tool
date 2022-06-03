import './App.css';
import Konva from 'konva'
import React, {useState,useEffect} from 'react'
import {Vertex,Edge} from './Classes'
import {BFS,DFS,Dijkstra} from './Algorithms'
import drawGrid from './drawgrid'
import {Actions,help} from './Actions'
import {Info} from './Icons'
import {Visualize} from './Visualize'
import {Modal, Button} from "react-bootstrap"
function App() {
    const [stage, setStage] = useState()
    const [layer, setLayer] = useState()
    const [height,setHeight] = useState(500)
    const [width,setWidth] = useState(document.body.clientWidth)
    useEffect(() => {
        document.getElementById("vertex").defaultChecked = true
        const s = new Konva.Stage({
            container: 'container', // id of container <div>
            width: width,
            height: height
        })
        const l = new Konva.Layer()
        setStage(s)
        setLayer(l)
        drawGrid(width, height, s, l)
    }, [])
    const [vertexID, setVertexID] = useState(0)
    const [vertices, setVertices] = useState([])
    const [edges, setEdges] = useState([])
    const [weight, setWeight] = useState(null)
    const [isDirected, setIsDirected] = useState(true)
    const [graph, setGraph] = useState({})
    const [drag, setDrag] = useState(false)
    const [info, setInfo] = useState(help["vertex"])

    useEffect(() => {
        //update the graph
        let g = {
            ...graph
        }
        vertices.forEach(vertex => {
            if (g[vertex.index] === undefined) {
                g[vertex.index] = []
            }
            edges.forEach(edge => {
                const dest = {index:edge.to.index,weight:edge.weight}
                if (vertex.index == edge.from.index && g[vertex.index].filter(e=>e.index===dest.index && e.weight===dest.weight).length===0) {
                    g[vertex.index].push(dest)
                }
            })
        })
        setGraph(g)
        console.log(g)
    }, [vertices, edges])
    useEffect(() => {
        if (drag) {
            vertices.forEach((vertex) => {
                vertex.startDrag()
                dragEdges(vertex)
            })
        }
        else{
          vertices.forEach((vertex) => {
              vertex.stopDrag()
          })
        }
    }, [drag])
    const [edgeStart, setEdgeStart] = useState(false)
    const [dijkstraStart, setDijkstraStart] = useState(false)

    const [op, setOp] = useState("vertex")

    // coordinates to the start of an edge [fromX, fromY]
    const [edge, setEdge] = useState([])

    // coordinates to a selected vertex
    const [selected, setSelected] = useState(new Vertex(-1, -1, -1))



    const dragEdges = (v) => {
        const group = v.getGroup()
        group.on('dragmove', () => {
            const e = edges.filter(edge => edge.from.index == v.index || edge.to.index == v.index)
            e.forEach((edge) => {
                if (edge.arrow !== null) {
                    if (edge.from.index == v.index) {
                        let from = {
                            x: group.x(),
                            y: group.y()
                        }
                        let to = {
                            x: edge.to.x,
                            y: edge.to.y
                        }
                        const newPoints = edge.calculatePoints(from, to)
                        edge.points = newPoints
                        edge.destroy()
                        edge.draw(stage, layer)
                    } else if (edge.to.index == v.index) {
                        let to = {
                            x: group.x(),
                            y: group.y()
                        }
                        let from = {
                            x: edge.from.x,
                            y: edge.from.y
                        }
                        const newPoints = edge.calculatePoints(from, to)
                        edge.points = newPoints
                        edge.destroy()
                        edge.draw(stage, layer)
                    }
                }

            })
        })
        group.on('dragend',()=>{
            const newcords = v.getCoords()
            v.x = newcords.x
            v.y = newcords.y
            setGraph({})
            setVertices((prevVertices) => [...prevVertices]) // trigger update graph

        })
    }
    const drawLine = (x, y) => {
        if (edgeStart == false) {
            setEdge([x, y])
            setEdgeStart(true)
        } else {
            setEdgeStart(false)
            //update list of edges
            let from, to
            from = vertices.find(vertex => vertex.x === edge[0] && vertex.y === edge[1])
            to = vertices.find(vertex => vertex.x === x && vertex.y === y)
            const e = new Edge(from, to, weight, isDirected)
            setEdges((prevEdges) => [...prevEdges, e])
            if (!isDirected) {
                const n = new Edge(to, from, weight, isDirected)
                setEdges((prevEdges) => [...prevEdges, n])
            }
            e.draw(stage, layer)
        }
    }
    const handleDelete = (vertex) => {
        const e = edges.filter(element => element.from.index == vertex.index || element.to.index == vertex.index) // edges to delete
        const v = vertices.filter(element => element.index !== vertex.index)
        setGraph({})
        setEdges(edges.filter(element => element.from.index != vertex.index && element.to.index != vertex.index))
        setVertices(v)
        vertex.destroy()
        e.forEach((e) => {
            e.destroy()
        })
    }
    const handleClick = (event) => {
        const x = event.nativeEvent.offsetX
        const y = event.nativeEvent.offsetY
        let draw = true
        vertices.forEach((vertex) => {
            // prevent draw if resulting vertex intersect with an already existing one
            let distSq = (x - vertex.x) * (x - vertex.x) +
                (y - vertex.y) * (y - vertex.y);
            let radSumSq = 1600; // (20 + 20) * (20 + 20) where 20 is the radius
            if (distSq <= radSumSq)
                draw = false
            //check if clicked on a vertex
            if (Math.sqrt((x - vertex.x) ** 2 + (y - vertex.y) ** 2) < 20) { // 20 is the radius of the circle
                selected.unselect()
                if ((op === "edge" || op === "Dijkstra") && vertex.index != selected.index && selected.index === -1) {
                    setSelected(vertex)
                    vertex.select("#2155CD") //blue
                } else {
                    setEdgeStart(false)
                    vertex.unselect()
                    setSelected(new Vertex(-1, -1, -1))
                }

                if (op === "delete") {
                    handleDelete(vertex)
                } else if (op === "edge") {
                    drawLine(vertex.x, vertex.y)
                } else if (op === "BFS") {
                    const res = BFS(graph, vertex.index)
                    Visualize(vertices,res,stage,layer)
                } else if (op === "DFS") {
                    const res = DFS(graph, vertex.index)
                    Visualize(vertices,res,stage,layer)
                }
                else if (op === "Dijkstra") {
                    setEdgeStart(false)
                    if(!dijkstraStart){
                      setInfo("Select a vertex to find shortest path to")
                      setDijkstraStart(true)
                    }
                    else{
                      const res = Dijkstra(graph, selected.index, vertex.index)
                      Visualize(vertices,res.result,stage,layer,res.dist)
                      if(res.spt[vertex.index]===null){
                        setInfo("No paths found from "+selected.index.toString()+" to "+vertex.index.toString())
                      }
                      else{
                        let i = vertex.index
                        let path = [vertex.index]
                        while(res.spt[i]!==null){
                          path.unshift(res.spt[i])
                          i = res.spt[i]
                        }
                        setInfo("Optimal path to "+vertex.index.toString()+" : "+path.toString())
                      }
                    }
                }
                draw = false
            }
        })
        if (draw && op === "vertex") {
            selected.unselect()
            setSelected(new Vertex(-1, -1, -1))
            setEdgeStart(false)
            const vertex = new Vertex(x, y, vertexID)
            setVertexID(prevID => prevID + 1)
            vertex.draw(stage, layer)
            setVertices((prevVertices) => [...prevVertices, vertex])
        }
    }
    const handleOps = (e) => {
        if (e.target.value === "drag") {
            setDrag(true)
        } else{
            setDrag(false)
        }
        if (e.target.value === "delete"){
          edges.forEach((edge) => {
            edge.arrow.on('click',()=>{edge.destroy();setGraph({});setEdges(edges.filter(e=>e!=edge))})
          });

        }
        if(e.target.value !== "Dijkstra"){
          vertices.forEach((v) => {
            v.destroyInfo()
          });

        }
        setOp(e.target.value)
        if(help[e.target.value] != undefined) setInfo(help[e.target.value]);
        else setInfo("")

    }
    return (
        <div>
    <br/><br/>
    <Actions onChange={handleOps}/>
    <br/><br/>
    <p style={{visibility:info===""?'hidden':'visible'}}><Info/> {info}</p>
    <div id="container" style={{height:height,width:width}} onClick={op!=="drag" ? handleClick : null}/>
    </div>
    );
}
export default App;
