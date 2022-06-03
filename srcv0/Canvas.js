import React, { useEffect, useState } from 'react'
import './Canvas.css'
const Canvas = props => {
  return (
    <canvas onClick={props.handleClick} onMouseDown={props.onMouseDown} onMouseUp={props.onMouseUp} id="canvas" height="500" width={document.body.clientWidth}/>)
}
const drawGrid = (w, h, ctx)=>{
    //rgba(229, 231, 233)
    var data = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> \
        <defs> \
            <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse"> \
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(229, 231, 233)" stroke-width="0.4" /> \
            </pattern> \
        </defs> \
        <rect width="100%" height="100%" fill="url(#smallGrid)" /> \
    </svg>';

    var DOMURL = window.URL || window.webkitURL || window;
    
    var img = new Image();
    var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    var url = DOMURL.createObjectURL(svg);
    
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);
    }
    img.src = url;
}
export default Canvas
export {drawGrid}
