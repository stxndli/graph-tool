import {Vertex} from './Classes'
const Visualize = (result, ctx)=>{
	let i = 0      
	let vertex         
	function vis(){
		setTimeout(()=>{
			vertex = JSON.parse(result[i])
			vertex = new Vertex(vertex.x, vertex.y, vertex.index)
			vertex.select(ctx, "#EB5353") //red
			i++
			if(i<result.length){
				vis()
			}
			else{
				setTimeout(()=>{
					result.forEach((e)=>{
						vertex = JSON.parse(e)
						vertex = new Vertex(vertex.x, vertex.y, vertex.index)
						vertex.unselect(ctx)
					})
				},500)
			}
		}, 500)
	}  
	vis()
}
const BFS = (graph, start, ctx)=>{
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
		graph[s].forEach((i)=>{
			if(visited[i] == false){
				queue.push(i)
				visited[i] = true
			}
		})
	}
	Visualize(result, ctx)
}
const DFSUtil = (graph, v, visited)=>{
	visited.push(v)
	console.log(v)
	graph[v].forEach((neighbour)=>{
		if(!visited.includes(neighbour)){
			DFSUtil(graph, neighbour, visited)
		}
	})

}
const DFS = (graph, start, ctx)=>{
	let v = start
	let visited = []
	DFSUtil(graph, v, visited)
	Visualize(visited, ctx)
}

const Dijkstra = (graph, start, end, ctx)=>{
	function minDistance(){
		const min = 1e7
	}
	let dist = {...graph}
	let spt = dist
	for(const v in dist){
		dist[v] = 1e7
		spt[v] = false
	}
	dist[start] = 0
	for(const v in graph){
		const m = minDistance()
		spt[m] = true
		for(const i in graph){

		}

	}

}

export {BFS, DFS}