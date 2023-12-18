import { Vertex } from "./Classes";
const BFS = (graph, src) => {
  let result = [];
  let s = src;
  let visited = { ...graph };
  for (const v in visited) {
    visited[v] = false;
  }
  let queue = [];
  queue.push(s);
  visited[s] = true;
  while (queue.length > 0) {
    s = queue.shift();
    result.push(s);
    graph[s].forEach((neighbour) => {
      if (visited[neighbour.index] == false) {
        queue.push(neighbour.index);
        visited[neighbour.index] = true;
      }
    });
  }
  return result;
};
const DFSUtil = (graph, v, visited) => {
  visited.push(v);
  if (graph[v].length > 0) {
    graph[v].forEach((neighbour) => {
      if (!visited.includes(neighbour.index)) {
        DFSUtil(graph, neighbour.index, visited);
      }
    });
  }
};
const DFS = (graph, src) => {
  let visited = [];
  DFSUtil(graph, src, visited);
  return visited;
};

const Dijkstra = (graph, src) => {
  function minDist(q) {
    let m = 1e7;
    let node = q[0];
    q.forEach((v) => {
      if (dist[v] < m) {
        m = dist[v];
        node = v;
      }
    });
    return q.indexOf(node);
  }
  let result = [];
  let dist = { ...graph };
  let optimalPath = { ...graph };
  let nodes = [];
  for (const v in dist) {
    dist[v] = 1e7;
    optimalPath[v] = null;
    nodes.push(v);
  }
  let distState = [];
  dist[src] = 0;
  distState.push({ ...dist });
  result.push(src);
  while (nodes.length > 0) {
    const index = minDist(nodes);
    const min = nodes[index];
    nodes.splice(index, 1);
    graph[min].forEach((neighbour) => {
      if (neighbour.weight < 0) {
        return 0; // graph contains negative weights
      }
      result.push(neighbour.index);
      let weight = 1;
      if (neighbour.weight !== null) {
        weight = neighbour.weight;
      }
      const alt = dist[min] + weight;
      if (alt < dist[neighbour.index]) {
        dist[neighbour.index] = alt;
        optimalPath[neighbour.index] = min;
      }
      const d = { ...dist };
      distState.push(d);
    });
  }
  return { result: result, dist: distState, spt: optimalPath };
};
const BellmanFord = (graph, edges, src, dest) => {
  // code 0: not directed graph
  // code 1: graph contains negative cycles
  const V = Object.keys(graph).length;
  let optimalPath = [];
  let result = {};
  for (const v in graph) {
    result[v] = { distance: 1e7, from: null };
  }
  result[src].distance = 0;
  result[src].from = null;
  // edge relaxation
  for (let i = 0; i < V - 1; i++) {
    edges.forEach((edge) => {
      if (!edge.isDirected) {
        return 0;
      }
      let weight;
      if (edge.weight) {
        weight = edge.weight;
      } else {
        weight = 1; // assume weight = 1
      }
      if (
        result[edge.from.index].distance + weight <
        result[edge.to.index].distance
      ) {
        result[edge.to.index].distance =
          result[edge.from.index].distance + weight;
        result[edge.to.index].from = edge.from.index;
      }
    });
  }
  // check for negative cycles
  edges.forEach((edge) => {
    let weight;
    if (edge.weight) {
      weight = edge.weight;
    } else {
      weight = 1; // assume weight = 1
    }
    if (
      result[edge.from.index].distance + weight <
      result[edge.to.index].distance
    ) {
      return 1;
    }
  });

  // rebuild shortest path
  let tmp = dest;
  while (tmp !== src && tmp !== null) {
    optimalPath.push(tmp);
    tmp = result[tmp].from;
  }
  return { result: result, spt: optimalPath };
};
const isConnected = (graph) => {
  let V = Object.keys(graph).length;
  let i;
  let visited = [];
  const startNode = Object.keys(graph)[0];
  DFSUtil(graph, parseInt(startNode), visited);
  for (let i = 0; i < V; i++) {
    if (!visited.includes(parseInt(Object.keys(graph)[i]))) {
      return false;
    }
  }
  return true;
};

const isEulerian = (graph) => {
  if (isConnected(graph) === false) return 0;

  let odd = 0;
  for (let i = 0; i < Object.keys(graph).length; i++)
    if (graph[Object.keys(graph)[i]].length % 2 != 0) odd++;

  if (odd > 2) return "Graph is not Eulerian";

  return odd == 2 ? "Graph is semi Eulerian" : "Graph is Eulerian";
};

const findArticulationPointsBak = (graph) => {
  if (!isConnected(graph)) return -1;
  const ap = [];
  for (const v in graph) {
    const filteredGraph = { ...graph };
    const vertexToTest = v;
    delete filteredGraph[v];
    for (const i in filteredGraph) {
      filteredGraph[i] = filteredGraph[i].filter((n) => {
        return n.index !== parseInt(vertexToTest);
      });
    }
    if (!isConnected(filteredGraph)) {
      ap.push(vertexToTest);
    }
  }
  return ap;
};

function findArticulationPoints(g) {
  const graph = { ...g };
  const discovery = { timeOfNode: {}, dfsOrder: 0 };
  const low = {};
  const bridges = [];

  for (const v in graph) {
    if (discovery.timeOfNode[v] == undefined)
      dfsBridges(graph, v, null, discovery, low, bridges);
  }
  return bridges;
}

function dfsBridges(graph, start, parent, discovery, low, bridges) {
  discovery.timeOfNode[start] = discovery.dfsOrder++;
  low[start] = discovery.timeOfNode[start];

  graph[start].forEach((adjNodeObject) => {
    const adjNode = adjNodeObject.index;

    if (adjNode == parent) return;

    // if it is a forward edge
    if (discovery.timeOfNode[adjNode] == undefined) {
      dfsBridges(graph, adjNode, start, discovery, low, bridges);
      low[start] = Math.min(low[start], low[adjNode]);

      if (discovery.timeOfNode[start] < low[adjNode] && parent !== null) {
        bridges.push(start);
      }
    } else {
      // backward edge
      low[start] = Math.min(discovery.timeOfNode[adjNode], low[start]);
    }
  });
}
const graphToMatrix = (graph) => {
  const strVertices = Object.keys(graph);
  const vertices = strVertices.map((v) => parseInt(v));
  const matrix = [];

  // Initialize the matrix with zeros
  for (let i = 0; i < vertices.length; i++) {
    matrix[i] = Array(vertices.length).fill(0);
  }

  // Populate the matrix with edge weights
  for (let i = 0; i < vertices.length; i++) {
    const adjNodes = graph[vertices[i]];
    for (const adjNode of adjNodes) {
      const j = vertices.indexOf(adjNode.index);
      matrix[i][j] = adjNode.weight;
    }
  }
  console.log("GRAPH TO MATRIX: ", matrix);
  return matrix;
};
const TSPExhaustive = (graph, s, vertex) => {
  // store minimum weight
  // Hamiltonian Cycle.
  let min_path = Number.MAX_VALUE;
  var nodes = [];
  var oldMinPath = min_path;
  do {
    // store current Path weight(cost)
    let current_pathweight = 0;

    // compute current path weight
    let k = s;

    for (let i = 0; i < vertex.length; i++) {
      current_pathweight += graph[k][vertex[i]];
      k = vertex[i];
    }
    current_pathweight += graph[k][s];
    oldMinPath = min_path;

    // update minimum
    min_path = Math.min(min_path, current_pathweight);
    if (min_path < oldMinPath) {
      nodes = [...vertex];
    }
  } while (findNextPermutation(vertex));
  return { min_path, nodes };
};

// Function to swap the data
// present in the left and right indices
const swap = (data, left, right) => {
  // Swap the data
  let temp = data[left];
  data[left] = data[right];
  data[right] = temp;

  // Return the updated array
  return data;
};

// Function to reverse the sub-array
// starting from left to the right
// both inclusive
const reverse = (data, left, right) => {
  // Reverse the sub-array
  while (left < right) {
    let temp = data[left];
    data[left++] = data[right];
    data[right--] = temp;
  }

  // Return the updated array
  return data;
};

// Function to find the next permutation
// of the given integer array
const findNextPermutation = (data) => {
  // If the given dataset is empty
  // or contains only one element
  // next_permutation is not possible
  if (data.length <= 1) {
    return false;
  }
  let last = data.length - 2;

  // find the longest non-increasing
  // suffix and find the pivot
  while (last >= 0) {
    if (data[last] < data[last + 1]) {
      break;
    }
    last--;
  }

  // If there is no increasing pair
  // there is no higher order permutation
  if (last < 0) {
    return false;
  }
  let nextGreater = data.length - 1;

  // Find the rightmost successor
  // to the pivot
  for (let i = data.length - 1; i > last; i--) {
    if (data[i] > data[last]) {
      nextGreater = i;
      break;
    }
  }

  // Swap the successor and
  // the pivot
  data = swap(data, nextGreater, last);

  // Reverse the suffix
  data = reverse(data, last + 1, data.length - 1);

  // Return true as the
  // next_permutation is done
  return true;
};

// TSP BY BACKTRACKING
function TSPBackTrack(graph, start, n) {
  var ans = { value: Number.MAX_VALUE };
  // Boolean array to check if a node
  // has been visited or not
  var v = Array(n).fill(false);
  // Mark 0th node as visited
  v[start] = true;
  var t0 = performance.now();
  TSPBackTrackUtil(graph, start, n, 1, 0, ans, v);
  var t1 = performance.now();
  return { t0, t1, res: ans.value };
}
function TSPBackTrackUtil(graph, currPos, n, count, cost, ans, v) {
  // If last node is reached and it has a link
  // to the starting node i.e the source then
  // keep the minimum value out of the total cost
  // of traversal and "ans"
  // Finally return to check for more possible values
  if (count == n && graph[currPos][0]) {
    ans.value = Math.min(ans.value, cost + graph[currPos][0]);
    return;
  }

  // BACKTRACKING STEP
  // Loop to traverse the adjacency list
  // of currPos node and increasing the count
  // by 1 and cost by graph[currPos][i] value
  for (var i = 0; i < n; i++) {
    if (!v[i] && graph[currPos][i]) {
      // Mark as visited
      v[i] = true;
      TSPBackTrackUtil(
        graph,
        i,
        n,
        count + 1,
        cost + graph[currPos][i],
        ans,
        v
      );

      // Mark ith node as unvisited
      v[i] = false;
    }
  }
}

function TSPNearestNeighbour(graph, start, list) {
  var visited = [];
  visited.push(0);
  var result = 0;
  let index = start;
  var oldIndex = 0;
  var filteredlist = [];
  var value = 0;
  while (true) {
    filteredlist = list.filter((item) => item !== index);
    list = [...filteredlist];
    oldIndex = index;
    value = graph[index][list[0]];
    for (var i = 1; i < graph[oldIndex].length; i++) {
      if (graph[oldIndex][i] <= value && !visited.includes(i) && i != index) {
        value = graph[oldIndex][i];
        index = i;
      }
    }
    if (oldIndex == index) break;
    visited.push(index);
    result += value;
  }
  result += graph[index][0];
  return result;
}
export {
  BFS,
  DFS,
  Dijkstra,
  isEulerian,
  BellmanFord,
  findArticulationPoints,
  TSPExhaustive,
  TSPBackTrack,
  TSPNearestNeighbour,
  graphToMatrix,
};
