import Konva from "konva";
import React, { useState, useEffect } from "react";
import { Vertex, Edge } from "./Classes";
import {
  BFS,
  DFS,
  Dijkstra,
  isEulerian,
  BellmanFord,
  findArticulationPoints,
} from "./Algorithms";
import drawGrid from "./drawgrid";
import { Actions, help } from "./Actions";
import { Info, Gear } from "./Icons";
import {
  Visualize,
  VisualizeDijkstra,
  VisualizeBellmanFord,
} from "./Visualize";
import EdgeModal from "./Modal";
function App() {
  const [stage, setStage] = useState();
  const [layer, setLayer] = useState();
  const [height, setHeight] = useState(500);
  const [width, setWidth] = useState(document.body.clientWidth - 100);
  useEffect(() => {
    document.getElementById("vertex").defaultChecked = true;
    const s = new Konva.Stage({
      container: "container", // id of container <div>
      width: width,
      height: height,
    });
    const l = new Konva.Layer();
    setStage(s);
    setLayer(l);
    drawGrid(width, height, s, l);
  }, []);
  const [vertexID, setVertexID] = useState(0);
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [weight, setWeight] = useState(null);
  const [graph, setGraph] = useState({});
  const [drag, setDrag] = useState(false);
  const [info, setInfo] = useState(help["vertex"]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    //update the graph
    let g = {
      ...graph,
    };
    vertices.forEach((vertex) => {
      if (g[vertex.index] === undefined) {
        g[vertex.index] = [];
      }
      edges.forEach((edge) => {
        const dest = { index: edge.to.index, weight: edge.weight };
        if (
          vertex.index == edge.from.index &&
          g[vertex.index].filter(
            (e) => e.index === dest.index && e.weight === dest.weight
          ).length === 0
        ) {
          g[vertex.index].push(dest);
        }
      });
    });
    setGraph(g);
    console.log(g);
  }, [vertices, edges]);
  useEffect(() => {
    if (drag) {
      vertices.forEach((vertex) => {
        vertex.startDrag();
        dragEdges(vertex);
      });
    } else {
      vertices.forEach((vertex) => {
        vertex.stopDrag();
      });
    }
  }, [drag]);
  const [edgeStart, setEdgeStart] = useState(false);
  const [shortestPathInit, setShortestPathInit] = useState(false);

  const [op, setOp] = useState("vertex");

  // coordinates to the start of an edge [fromX, fromY]
  const [edge, setEdge] = useState({ x1: null, y1: null, x2: null, y2: null });

  // coordinates to a selected vertex
  const [selected, setSelected] = useState(new Vertex(-1, -1, -1));

  const dragEdges = (v) => {
    const group = v.getGroup();
    group.on("dragmove", () => {
      const e = edges.filter(
        (edge) => edge.from.index == v.index || edge.to.index == v.index
      );
      e.forEach((edge) => {
        if (edge.arrow !== null) {
          if (edge.from.index == v.index && edge.to.index == v.index) {
            let from = {
              x: group.x(),
              y: group.y(),
            };
            let to = {
              x: group.x(),
              y: group.y(),
            };
            const newPoints = edge.calculatePoints(from, to);
            edge.points = newPoints;
            edge.destroy();
            edge.draw(stage, layer);
          } else if (edge.from.index == v.index) {
            let from = {
              x: group.x(),
              y: group.y(),
            };
            let to = {
              x: edge.to.x,
              y: edge.to.y,
            };
            const newPoints = edge.calculatePoints(from, to);
            edge.points = newPoints;
            edge.destroy();
            edge.draw(stage, layer);
          } else if (edge.to.index == v.index) {
            let to = {
              x: group.x(),
              y: group.y(),
            };
            let from = {
              x: edge.from.x,
              y: edge.from.y,
            };
            const newPoints = edge.calculatePoints(from, to);
            edge.points = newPoints;
            edge.destroy();
            edge.draw(stage, layer);
          }
        }
      });
    });
    group.on("dragend", () => {
      const newcords = v.getCoords();
      v.x = newcords.x;
      v.y = newcords.y;
      setGraph({});
      setVertices((prevVertices) => [...prevVertices]); // trigger update graph
    });
  };
  const drawLine = (coords, isDirected) => {
    //update list of edges
    let from, to;
    from = vertices.find(
      (vertex) => vertex.x === coords.x1 && vertex.y === coords.y1
    );
    to = vertices.find(
      (vertex) => vertex.x === coords.x2 && vertex.y === coords.y2
    );
    const e = new Edge(from, to, weight, isDirected);
    setEdges((prevEdges) => [...prevEdges, e]);
    e.draw(stage, layer);
    if (!isDirected) {
      const n = new Edge(to, from, weight, isDirected);
      setEdges((prevEdges) => [...prevEdges, n]);
    } else {
      const filtered = edges.filter(
        (edge) => edge.from === to && edge.to === from
      );
      if (filtered.length > 0) {
        filtered[0].curve();
        e.curve(true);
      }
    }
  };
  const handleDelete = (vertex) => {
    const e = edges.filter(
      (element) =>
        element.from.index == vertex.index || element.to.index == vertex.index
    ); // edges to delete
    const v = vertices.filter((element) => element.index !== vertex.index);
    setGraph({});
    setEdges(
      edges.filter(
        (element) =>
          element.from.index != vertex.index && element.to.index != vertex.index
      )
    );
    setVertices(v);
    vertex.destroy();
    e.forEach((e) => {
      e.destroy();
    });
  };
  const handleClick = (event) => {
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    let draw = true;
    vertices.forEach((vertex) => {
      // prevent draw if resulting vertex intersect with an already existing one
      let distSq =
        (x - vertex.x) * (x - vertex.x) + (y - vertex.y) * (y - vertex.y);
      let radSumSq = 1600; // (20 + 20) * (20 + 20) where 20 is the radius
      if (distSq <= radSumSq) draw = false;
      //check if clicked on a vertex
      if (Math.sqrt((x - vertex.x) ** 2 + (y - vertex.y) ** 2) < 20) {
        // 20 is the radius of the circle
        selected.unselect();
        if (
          (op === "edge" || op === "Dijkstra" || op === "Bellman Ford") &&
          vertex.index != selected.index &&
          selected.index === -1
        ) {
          setSelected(vertex);
          vertex.select("#2155CD");
        } else {
          setEdgeStart(false);
          vertex.unselect();
          setSelected(new Vertex(-1, -1, -1));
        }

        if (op === "delete") {
          handleDelete(vertex);
        } else if (op === "edge") {
          if (!edgeStart) {
            let e = edge;
            edge.x1 = vertex.x;
            edge.y1 = vertex.y;
            setEdge(e);
            setEdgeStart(true);
          } else {
            let e = edge;
            edge.x2 = vertex.x;
            edge.y2 = vertex.y;
            setEdge(e);
            setEdgeStart(false);
            setShowModal(true);
          }
          //drawLine(vertex.x, vertex.y)
        } else if (op === "BFS") {
          const res = BFS(graph, vertex.index);
          Visualize(vertices, res);
        } else if (op === "DFS") {
          const res = DFS(graph, vertex.index);
          Visualize(vertices, res);
        } else if (op === "Dijkstra") {
          setEdgeStart(false);
          if (!shortestPathInit) {
            setInfo("Select a vertex to find shortest path to");
            setShortestPathInit(true);
          } else {
            setShortestPathInit(false);
            const res = Dijkstra(graph, selected.index, vertex.index);
            if (res === 0) {
              setInfo("Graph contains negative weights");
            } else {
              VisualizeDijkstra(vertices, res.result, res.dist);
              if (res.spt[vertex.index] === null) {
                setInfo(
                  "No paths found from " +
                    selected.index.toString() +
                    " to " +
                    vertex.index.toString()
                );
              } else {
                let i = vertex.index;
                let path = [vertex.index];
                while (res.spt[i] !== null) {
                  path.unshift(res.spt[i]);
                  i = res.spt[i];
                }
                setInfo(
                  "Shorest path found : " +
                    path.toString().replaceAll(",", " => ")
                );
              }
            }
          }
        } else if (op === "Bellman Ford") {
          setEdgeStart(false);
          if (!shortestPathInit) {
            setInfo("Select a vertex to find shortest path to");
            setShortestPathInit(true);
          } else {
            setShortestPathInit(false);
            const res = BellmanFord(graph, edges, selected.index, vertex.index);
            if (res === 0) {
              setInfo("Graph is not directed");
            } else if (res === 1) {
              setInfo("Graph contains negative cycles");
            } else {
              if (res.result[vertex.index].from === null) {
                setInfo(
                  "No paths found from " +
                    selected.index.toString() +
                    " to " +
                    vertex.index.toString()
                );
                VisualizeBellmanFord(vertices, edges, res.result, [], false);
              } else {
                let path = [];
                res.spt.forEach((i) => {
                  path.unshift(i);
                });
                path.unshift(selected.index);
                setInfo(
                  "Shorest path found : " +
                    path.toString().replaceAll(",", " => ")
                );
                VisualizeBellmanFord(vertices, edges, res.result, path, true);
              }
            }
          }
        }
        draw = false;
      }
    });
    if (draw && op === "vertex") {
      selected.unselect();
      setSelected(new Vertex(-1, -1, -1));
      setEdgeStart(false);
      const vertex = new Vertex(x, y, vertexID);
      setVertexID((prevID) => prevID + 1);
      vertex.draw(stage, layer);
      setVertices((prevVertices) => [...prevVertices, vertex]);
    }
  };
  const handleOps = (e) => {
    edges.forEach((edge) => {
      if (edge.arrow) {
        edge.unselect();
      }
    });
    vertices.forEach((v) => {
      v.destroyInfo();
    });
    setDrag(false);
    if (e.target.value === "drag") {
      setDrag(true);
    } else if (e.target.value === "delete") {
      edges.forEach((edge) => {
        if (edge.arrow !== null) {
          edge.arrow.on("click", () => {
            edge.destroy();
            setGraph({});
            setEdges(edges.filter((e) => e != edge));
          });
        }
      });
    }
    setOp(e.target.value);
    if (help[e.target.value] !== undefined) setInfo(help[e.target.value]);
    else if (e.target.value === "Eulerian") {
      const res = isEulerian(graph);
      setInfo(res);
    } else if (e.target.value === "AP") {
      const ap = findArticulationPoints(graph);
      if (ap === -1) {
        setInfo("Graph is not connected");
      } else if (ap.length === 0) {
        setInfo("No articulation points found");
      } else {
        let res = "Articulation points: ";
        res += ap.toString();
        setInfo(res);
      }
    } else setInfo("");
  };
  const handleWeight = (e) => {
    const v = e.target.value;
    if (
      !isNaN(v) &&
      (function (x) {
        return (x | 0) === x;
      })(parseFloat(v))
    ) {
      setWeight(parseInt(v));
    } else {
      setWeight(null);
    }
  };
  return (
    <div>
      <Actions onChange={handleOps} />
      <div className="main">
        <h1>Graph Tool</h1>
        <div className="row">
          <EdgeModal
            show={showModal}
            hide={() => setShowModal(false)}
            directed={() => {
              setShowModal(false);
              drawLine(edge, true);
              setWeight(null);
            }}
            undirected={() => {
              setShowModal(false);
              drawLine(edge, false);
              setWeight(null);
            }}
            handleWeight={handleWeight}
          />
        </div>
        <p
          className="alert alert-success"
          style={{ visibility: info === "" ? "hidden" : "visible" }}
          id="info"
        >
          <Info /> {info}
        </p>
        <div
          id="container"
          style={{
            height: height,
            width: width,
            backgroundColor: "white",
            zIndex: "1",
            position: "absolute",
          }}
          onClick={op !== "drag" ? handleClick : null}
        />
      </div>
    </div>
  );
}
export default App;
