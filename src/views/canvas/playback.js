import React, {PureComponent} from 'react'
import Button from 'material-ui/Button'

export default class PlaybackPanel extends PureComponent {


    render() {

        return(
            <div style={{display: "flex", flexDirection: "column", backgroundColor: "c3c3c3"}}>
                <svg viewBox= {"0 0 "+String(this.props.width) +" 20"} xmlns="http://www.w3.org/2000/svg" style={{height: 20}}>
                    <line x1="0" y1="10" x2={String((this.props.time/180) * this.props.width)} y2="10" stroke="black" />
                </svg>

                <div style={{display: "flex", flexDirection: "row"}}>
                    <div style={{position: "absolute", margin: 8}}>
                        {String(this.props.time).substring(0, 4)}
                    </div>
                    <div style={{marginLeft: 50}}>
                        <Button onClick={this.props.play}>{this.props.playing ? "Pause" : "Play"}</Button> 
                        <Button onClick={this.props.stop}>Stop</Button>      
                    </div>         
                </div>        
            </div>

        )
    }
}