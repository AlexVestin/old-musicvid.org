import React, {PureComponent} from 'react'

import { setFps, setClipDuration } from '../../redux/actions/globals'
import { connect } from 'react-redux'

class ProjectSettings extends PureComponent {


    render() {
        const { fps, clipDuration } = this.props

        return(
            <div style={{ width: "100%", height: "100%" , margin: 10, fontSize: 20}}>
                Configurarion
                <Input onChange={(e) => setFps(e.target.value)}  value={fps} type="number" label="fps"></Input>
                <Input onChange={(e) => setClipDuration(e.target.value)} value={clipDuration} type="number" label="Clip duration"></Input>
            </div>
        )
    }
}

class Input extends PureComponent {
    state = {value: ""}

    render() {
        const { label, type, value, onChange } = this.props
        return(
            <div style={{height: 30, borderBottom: "1px solid gray", margin: 20, width: "calc(90% - 30px)", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <div style={{fontSize: 14, marginTop: 8}}>{label}</div>
                <div><input value={value} onChange={onChange} style={{height: 12}} type={type}></input></div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        fps:  state.globals.fps,
        clipDuration:  state.globals.clipDuration,
    }
}

export default connect(mapStateToProps)(ProjectSettings)