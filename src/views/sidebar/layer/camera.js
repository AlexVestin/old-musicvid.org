import React from 'react';
import ConfigList from '../input'
import { connect } from 'react-redux'
import { editCamera, setSidebarWindowIndex } from '../../../redux/actions/items'

class Camera extends React.PureComponent {
    back = () => {
        setSidebarWindowIndex(this.props.idxs.ITEMS)
    }

    handleChange = input => event => {
        var value = event.target.value
        editCamera({key: input.key, value: value})
    }


    addAutomation = (key) => {
        const {selectedItem} = this.props 
        const point = {time: selectedItem.start, value: selectedItem[key], id: Math.floor(Math.random() * 1000000)}
        const automation = {name: key, points: [point], interpolationPoints: [], id: Math.floor(Math.random() * 1000000) }
        //addAutomation({key, automation})
    }

    render() {
        const item = this.props.cameras[this.props.selectedLayerId]
        const defaultConfig = item.defaultConfig;

        return (
            <ConfigList 
                handleChange={this.handleChange} 
                defaultConfig={defaultConfig} 
                item={item} 
                addAutomation={this.addAutomation}
                onBack={this.back}>
            </ConfigList>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        selectedLayerId: state.items.selectedLayerId,
        cameras: state.items.cameras
    }
}

export default connect(mapStateToProps)(Camera)