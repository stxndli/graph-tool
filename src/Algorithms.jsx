import {Vertex} from './Classes'
const BFS = (graph, start)=>{
	let result = []
	let s = start
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
const DFS = (graph, start)=>{
	let visited = []
	DFSUtil(graph, start, visited)
	return visited
}

const Dijkstra = (graph, start, end)=>{
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
	dist[start] = 0
	distState.push({...dist})
	result.push(start)
	while(nodes.length>0){
		const index = minDist(nodes)
		const min = nodes[index]
		nodes.splice(index,1)
		graph[min].forEach((neighbour)=>{
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
export {BFS, DFS, Dijkstra, isEulerian}
