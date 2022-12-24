const Visualize = (vertices,result,dist=null)=>{
	let i = 0
	let vertex
	let v = []
	function vis(){
		setTimeout(()=>{
			if(dist!==null){
				vertices.forEach((v) => {
					if(dist[i][v.index]!==undefined){
					v.destroyInfo()
					let d = dist[i][v.index].toString()
					if(d==1e7){
						d = "∞"
					}
					v.info("Distance from root: "+d)
				}
				});
			}
			vertex = vertices.filter(e=>e.index==result[i])
      		vertex = vertex[0]
			vertex.select("#EB5353") //red
			v.push(vertex)
			i++
			if(i<result.length){
				vis()
			}
			else{
				setTimeout(()=>{
					v.forEach((vertex)=>{
						vertex.unselect()
					})
				},500)
			}
		}, 500)
	}
	vis()
}
const VisualizeDijkstra = (vertices,result,dist) => {
	let i = 0
	let vertex
	let v = []
	function vis(){
		setTimeout(()=>{
			vertices.forEach((vertex)=>{
				if(dist[i][vertex.index]!==undefined){
					vertex.destroyInfo()
					let d = dist[i][vertex.index].toString()
					if(d==1e7){
						d = "∞"
					}
					vertex.info("Distance from source: "+d)
				}
			})
			vertex = vertices.filter(e=>e.index==result[i])
      		vertex = vertex[0]
			vertex.select("#EB5353") //red
			v.push(vertex)
			i++
			if(i<result.length){
				vis()
			}
			else{
				setTimeout(()=>{
					v.forEach((vertex)=>{
						vertex.unselect()
					})
				},1000)
			}
		}, 1000)
	}
	vis()
}
const VisualizeBellmanFord = (vertices,edges,result,path,pathFound) => {
	vertices.forEach((vertex)=>{
		if(result[vertex.index]!==undefined){
			vertex.destroyInfo()
			let d = result[vertex.index].distance.toString()
			if(d==1e7){
				d = "∞"
			}
			vertex.info("Distance from source: "+d)
		}
	})
	if(pathFound){
		path.forEach((vertex)=>{
			let edgeToSelect = edges.filter(e=>e.to.index===vertex && e.from.index === result[vertex].from)
			edgeToSelect = edgeToSelect[0]
			if(edgeToSelect!==undefined){
				console.log(edgeToSelect)
				edgeToSelect.select("#EB5353")
			}
		})
	}
}
export {Visualize,VisualizeDijkstra,VisualizeBellmanFord}
