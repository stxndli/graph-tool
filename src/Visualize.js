const Visualize = (vertices,result,stage,layer,dist=null)=>{
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
				},1000)
			}
		}, 1000)
	}
	vis()
}
export {Visualize}
