import {Vertex} from './Classes'
const BFS = (graph, src)=>{
	let result = []
	let s = src
	let visited = {...graph}
	for(const v in visited){
		visited[v] = false
	}
	let queue = []
	queue.push(s)
	visited[s] = true
	while(queue.length>0){
		s = queue.shift()
		result.push(s)
		graph[s].forEach((neighbour)=>{

			if(visited[neighbour.index] == false){
				queue.push(neighbour.index)
				visited[neighbour.index] = true
			}
		})
	}
	return result
}
const DFSUtil = (graph, v, visited)=>{
	visited.push(v)
	if(graph[v].length>0){
	graph[v].forEach((neighbour)=>{
		if(!visited.includes(neighbour.index)){
			DFSUtil(graph, neighbour.index, visited)
		}
	})}

}
const DFS = (graph, src)=>{
	let visited = []
	DFSUtil(graph, src, visited)
	return visited
}

const Dijkstra = (graph, src)=>{
	function minDist(q){
		let m = 1e7
		let node = q[0]
		q.forEach((v)=>{
			if(dist[v]<m){
				m = dist[v]
				node = v
			}
		})
		return q.indexOf(node)
	}
	let result = []
	let dist = {...graph}
	let optimalPath = {...graph}
	let nodes = []
	for(const v in dist){
		dist[v] = 1e7
		optimalPath[v] = null
		nodes.push(v)
	}
	let distState = []
	dist[src] = 0
	distState.push({...dist})
	result.push(src)
	while(nodes.length>0){
		const index = minDist(nodes)
		const min = nodes[index]
		nodes.splice(index,1)
		graph[min].forEach((neighbour)=>{
			if(neighbour.weight < 0){
				return 0 // graph contains negative weights
			}
			result.push(neighbour.index)
			let weight = 1
			if(neighbour.weight!==null){
				weight = neighbour.weight
			}
			const alt = dist[min]+weight
			if(alt<dist[neighbour.index]){
				dist[neighbour.index] = alt
				optimalPath[neighbour.index] = min
			}
			const d = {...dist}
			distState.push(d)
		})
	}
	return {result:result,dist:distState,spt:optimalPath}
}
const BellmanFord = (graph, edges, src, dest)=>{
	// code 0: not directed graph
	// code 1: graph contains negative cycles
	const V = Object.keys(graph).length
	let optimalPath = []
	let result = {}
	for(const v in graph){
		result[v] = {distance:1e7, from: null}
	}
	result[src].distance = 0
	result[src].from = null
	// edge relaxation
	for (let i = 0; i < V - 1; i++){
        edges.forEach((edge)=>{
			if(!edge.isDirected){
				return 0
			}
			let weight
			if(edge.weight){
				weight = edge.weight
			}
			else{
				weight = 1 // assume weight = 1
			}
            if ((result[edge.from.index].distance + weight) < result[edge.to.index].distance){
				result[edge.to.index].distance = result[edge.from.index].distance + weight
				result[edge.to.index].from = edge.from.index
			}
                
        })
    }
	// check for negative cycles
	edges.forEach((edge)=>{
		let weight
			if(edge.weight){
				weight = edge.weight
			}
			else{
				weight = 1 // assume weight = 1
			}
        if ((result[edge.from.index].distance + weight) < result[edge.to.index].distance){
			return 1
		}
    })

	// rebuild shortest path
	let tmp = dest
	while(tmp!==src && tmp!==null){
		optimalPath.push(tmp)
		tmp = result[tmp].from
	}
	return {result:result,spt:optimalPath}
}
const isConnected = (graph)=>{
	let V = Object.keys(graph).length
	let i
	let visited = []
	for(i=0;i<V;i++){
		if(graph[Object.keys(graph)[i]].length!==0){
			break
		}
	}
	if(i===V){
		return true
	}
	DFSUtil(graph,parseInt(Object.keys(graph)[i]),visited)
	console.log(visited)
	for(let i=0;i<V;i++){
		if(!visited.includes(parseInt(Object.keys(graph)[i])) && graph[Object.keys(graph)[i]].length!==0){
			return false
		}
	}
	return true
}

const isEulerian = (graph) => {
	if (isConnected(graph) === false)
            return 0;
			
	let odd = 0;
	for (let i = 0; i < Object.keys(graph).length; i++)
		if (graph[Object.keys(graph)[i]].length%2!=0)
			odd++;

	if (odd > 2)
		return "Graph is not Eulerian";

	return (odd==2)? "Graph is semi Eulerian" : "Graph is Eulerian";
}
export {BFS, DFS, Dijkstra, isEulerian, BellmanFord}
