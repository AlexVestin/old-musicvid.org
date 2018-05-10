import React, { PureComponent } from 'react'

import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'


import Button from 'material-ui/Button'

export default class ClipInfoBar extends PureComponent {

    render(){
        const items = this.props.items
        return (
            <div style={{width: "15%", zIndex: 3, backgroundColor: "#434343", overflow: "hidden"}} >
                {[...Array(20)].map((e,i ) => 
                    <ClipItem key={i} item={this.props.items[i]} index={i}></ClipItem>
                )}
            </div>
        )
    }
}



const clipStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    fontSize: 10,
    color: "#D9D9D9",
    borderBottom: "1px solid gray"
}


class ClipItem extends PureComponent {
    state = {expanded: false}

    render(){
        const item = this.props.item
        if(!item) return null
        var str = item.name.length  < 10 ? item.name : item.name.substring(0, 30) + "..."

        const i = this.props.index
        const height = this.state.expanded ? 120 :  30;

        return(
            <div key={i} style={{...clipStyle, height}}>
                <div>
                    <div style={{marginLeft: 3}}>
                        {i + 1}
                    </div>
                    <div style={{marginTop: 2, marginLeft: 15, color: "white", fontSize: 10, display: "flex", flexDirection: "row"}}>
                         {!this.state.expanded && <KeyboardArrowDown onClick={() => this.setState({expanded: true})} style={{marginTop: -5}}/>}
                         {this.state.expanded && <KeyboardArrowUp onClick={() => this.setState({expanded: false})} style={{marginTop: -5}}/>}
                         
                        {str}
                    </div>
                </div>
                <div style={{marginTop: 5}}>

                </div>
            </div>
        )
    }
}


