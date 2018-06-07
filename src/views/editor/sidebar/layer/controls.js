import React from 'react';
import ConfigList from '../input'
import { connect } from 'react-redux'
import { editControls, setSidebarWindowIndex } from '@redux/actions/items'

class Controls extends React.PureComponent {
    back = () => {
        setSidebarWindowIndex(this.props.idxs.ITEMS)
    }

    handleChange = change => {
        editControls(change)
    }


    addAutomation = (key) => {
        const {selectedItem} = this.props 
        const point = {time: selectedItem.start, value: selectedItem[key], id: Math.floor(Math.random() * 1000000)}
        const automation = {name: key, points: [point], interpolationPoints: [], id: Math.floor(Math.random() * 1000000) }
        //addAutomation({key, automation})
    }

    render() {
        const item = this.props.controls[this.props.selectedLayerId]
        const defaultConfig = item.defaultConfig;

        return (
            <React.Fragment></React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        selectedLayerId: state.items.selectedLayerId,
        controls: state.items.controls
    }
}

export default connect(mapStateToProps)(Controls)