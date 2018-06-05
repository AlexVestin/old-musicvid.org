import React from 'react';
import ConfigList from '../input'
import { connect } from 'react-redux'
import { editCamera, setSidebarWindowIndex } from '../../../redux/actions/items'

class Camera extends React.PureComponent {
    back = () => {
        setSidebarWindowIndex(this.props.idxs.ITEMS)
    }

    handleChange = change => {
        editCamera(change)
    }


    addAutomation = (key) => {
        const {selectedItem} = this.props 
        const point = {time: selectedItem.start, value: selectedItem[key], id: Math.floor(Math.random() * 1000000)}
        const automation = {name: key, points: [point], interpolationPoints: [], id: Math.floor(Math.random() * 1000000) }
        //addAutomation({key, automation})
    }

    render() {
        const item = this.props.camera
        const defaultConfig = item.defaultConfig;

        return (
            <React.Fragment></React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        camera: state.items.cameras[state.items.selectedLayerId]
    }
}

export default connect(mapStateToProps)(Camera)