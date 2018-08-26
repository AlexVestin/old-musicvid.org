import React, { PureComponent } from 'react'

const colors = ["#001f3f"]

export default class Clip extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            position: {x: props.left, y: props.top},
            resizing: false,
            dx: 0,
            resizeLeftDx: 0,
            resizeRightDx: 0,
            
        }

        this.color = colors[Math.floor(Math.random() * colors.length)]
    }

    componentWillUnmount() {
        window.removeEventListener("mouseup", this.onMouseUp)
        window.removeEventListener("mousemove", this.onMouseMove)
        
    }
    componentDidMount() {
        window.addEventListener("mouseup", this.onMouseUp)
        window.addEventListener("mousemove", this.onMouseMove)
    }

    onMouseDown = (e) => {
        if(this.props.item.movable && !this.mouseDown && !this.resizeMouseDown) {
            this.props.selectItem({itemId: this.props.item.id, layerId: this.props.item.sceneId})
            this.mouseDown = true
            this.startX = e.clientX
        }
    }

    onMouseUp = (e) => {
        const { item, itemRightOffset } = this.props
        this.endX = e.clientX
        if(this.props.item.movable && this.mouseDown ) {
            this.mouseDown = false
            
            this.props.edit({key: "start", value: item.start + (this.state.dx) / itemRightOffset })
            this.setState({dx: 0})
        }

        if(this.resizeMouseDown) {
            this.resizeMouseDown = false
            const left = item.start + ((this.state.dx + this.state.resizeLeftDx) / itemRightOffset)
            const duration = item.duration + (this.state.resizeRightDx - this.state.resizeLeftDx) / itemRightOffset
            const offsetLeft = this.state.resizeLeftDx / itemRightOffset
            
            this.props.edit({key: "start", value: left})
            this.props.edit({key: "duration", value: duration})
            this.props.edit({key: "offsetLeft", value: offsetLeft})
            

            this.setState({resizeLeftDx: 0, resizeRightDx: 0})
        }

        this.startX = this.endX = 0
    }

    onMouseMove = (e) => {
        const { item, itemRightOffset, left } = this.props
        if(this.props.item.movable && this.mouseDown) {
            if(item.start + (e.clientX  - this.startX) / itemRightOffset >= 0) {
                this.setState({dx: e.clientX  - this.startX})
            }else {
                this.setState({dx: -left})
            } 
        }

        if(this.resizeMouseDown){
            const newDx = e.clientX - this.startX
            if(this.resizeLeft) {
               
                const duration = item.duration + (this.state.resizeRightDx - newDx) / itemRightOffset
                if(!item.maxDuration || (item.maxDuration > duration && (newDx / itemRightOffset) + item.offsetLeft >= 0)) {
                    
                    if(item.start + (e.clientX  - this.startX) / itemRightOffset >= 0 ) {
                        this.setState({resizeLeftDx: newDx})
                    }else {
                        this.setState({resizeLeftDx: -left})
                    } 
                } else {
                    const newd = -item.offsetLeft * itemRightOffset
                    this.setState({resizeLeftDx: newd})
                } 
            }else {
                const duration = item.duration + (newDx - this.state.resizeLeftDx) / itemRightOffset
                if(!item.maxDuration || item.maxDuration > duration + item.offsetLeft) {
                    this.setState({resizeRightDx: newDx})
                }else {
                    const newd = ((item.maxDuration - item.duration - item.offsetLeft) * itemRightOffset) - this.state.resizeLeftDx 
                    this.setState({resizeRightDx: newd})
                }
                    
            }
        }
    }

    resize = (resizeLeft, evt) => {
        evt.preventDefault()
        evt.stopPropagation()
        if( !this.resizeMouseDown && !this.mouseDown) {
            this.props.selectItem({itemId: this.props.item.id, layerId: this.props.item.sceneId})
            this.startX = evt.clientX
            this.resizeMouseDown = true
            this.resizeLeft = resizeLeft
        }
    }



    onStop = (e, b) => {
        if(this.props.item.movable) {
            if(this.props.item.start !== b.x) {
                this.props.edit({key: "start", value: b.x / ( this.props.zoomWidth * this.props.unitSize)})
            }
        }
    }
 
    getRelativeCoordinates = (evt) => {
        var e = evt.target
        var dim = e.getBoundingClientRect();
        var x = Math.floor(evt.clientX - dim.left);
        var y = Math.floor(evt.clientY - dim.top);
        return [x, y]
    }

    
    componentWillReceiveProps(props) {
        if(this.state.position.x  !== props.item.start * props.zoomWidth * props.unitSize){
            this.setState({position: {x: Math.floor(props.item.start * props.zoomWidth * props.unitSize), y: props.top} })
        }
    }

    render() {    
        const { height, top, item, zoomWidth, unitSize, left } = this.props
        let w = (item.duration * zoomWidth * unitSize) + this.state.resizeRightDx - this.state.resizeLeftDx
        let l = left + this.state.dx + this.state.resizeLeftDx

        const resizeWidth = w  > 24 ? 12 : Math.floor(w / 4)
        const resizeStyle = {
            position: "absolute",
            top: 0,
            width: resizeWidth,
            height: height
        }


        
        const HEADER_SIZE = 12
        //const startIndex = Math.floor(((l / (zoomWidth * unitSize)) * item.sampleRate) / item.precision)
        //const totalLength = (item.maxDuration * zoomWidth * unitSize) + this.state.resizeRightDx - this.state.resizeLeftDx
        //const newpoints = item.points.slice(startIndex, item.points.length -1)
      
        /*
          let stringPoints = ""
        item.points.forEach((e, i) => stringPoints += String(e[0])  +"," + String(e[1]) + " ")

        const BUCKET_WIDTH = 1
        const nrPoints = 100
           
        let count = 0

         {item.points.map((bucket, i) => {
                        const bucketSVGHeight = bucket * height;
                        return(
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    zIndex: 10,
                                    marginTop: HEADER_SIZE / 2,
                                    left: (i / item.points.length) * w,
                                    top: ~~(height - bucketSVGHeight) / 2.0,
                                    height: ~~bucketSVGHeight,
                                    width: BUCKET_WIDTH,
                                    backgroundColor: "white",
                                }}
                                /> 
                            ) 
                        }
                    )}
        */

     
        return (
            <div 
                onClick={this.onClick}
                style={{position:"relative", display: "flex", flexDirection: "row", zIndex: 2}} 
                onMouseDown={this.onMouseDown}
                draggable="false"
            >
                <div 
                    style={{
                        position: "absolute",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        width: w, 
                        top: top, 
                        height:height, 
                        left: l,
                        backgroundColor: this.color, 
                        border: "solid",
                        boxSizing: "border-box",
                        borderRadius: "0.12rem", 
                        borderWidth: 1,
                        borderColor: '#555555',
                    }}
                    draggable="false"
                    
                    >
                    
    
                    <div 
                        style={{
                            width: "100%",
                            position: "relative",
                            backgroundColor: "rgba(2,2,2,0.6)",
                            fontSize: HEADER_SIZE, 
                            fontFamily: "'Lucida Console', Monaco, monospace", 
                            color:"white", 
                            pointerEvents: "none", 
                            textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black",
                            MozUserSelect:"none",
                            WebkitUserSelect:"none",
                            msUserSelect:"none"
                        }}

                        draggable="false"
                        >
                        {item.name}
                    </div>
                        <div onMouseDown={(evt) => this.resize(true, evt)} style={{...resizeStyle,  left:  -resizeWidth / 2, cursor: "w-resize"}}></div>
                        <div onMouseDown={(evt) => this.resize(false, evt)} style={{...resizeStyle,  right: -resizeWidth / 2, cursor: "e-resize"}}></div>
                </div>
            </div>
        )
    }
}

const Bar = (props) => {

}
