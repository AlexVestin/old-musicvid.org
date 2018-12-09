import React, {PureComponent} from 'react'

import demos from './itempreview'
import { connect } from 'react-redux'
import { createItem, setSidebarWindowIndex } from '@redux/actions/items'
import  withHeader from '../../HOC/withheader';
import Modal from '../../modals/modal'
import List from './list'

class Previews extends PureComponent {

    constructor(props) {
        super(props);

        this.state = { modalOpen: false, listType: 0 }

        this.videoWidth = 195;
        this.videoHeight = 110;

        this.videoRef = React.createRef()
        this.imageRef = React.createRef()
    }

    back = () => {
        setSidebarWindowIndex(this.props.idxs.LAYER)
    };

    componentDidMount() {

        let add = (type, input) => {
            let file = input.files[0]
            let name = input.files[0].name

            createItem({type, file, name, keepAudio: this.keepAudio})
        }

        this.imageRef.current.onchange = () => {
            add("IMAGE", this.imageRef.current)
        }

        this.videoRef.current.onchange = () => {
            add("VIDEO", this.videoRef.current)
        }
    }

    loadVideo = (keepAudio) => {
        this.videoRef.current.click();
        this.keepAudio = keepAudio
        this.setState({modalOpen: false})
    }

    setPreviewImages = () => {
        this.setState({listType: 0})
    }

    setPreviewList = () => {
        this.setState({listType: 1})
    }

    closeModal = () => {
        this.setState({modalOpen: false})
        
    }

    addItem = (item) => {
        if(item.fileType === "video") {
            this.setState({modalOpen: true})
        }else if(item.fileType === "image") {
            this.imageRef.current.click()
        }else {
            createItem({type: item.type.toUpperCase()})            
        }

    }

    render() {
        let items; 
        if(this.props.layer.layerType === 1){
            items = demos.items3D;
        }else {
            items = demos.items2D;
        }

        return(
            <React.Fragment>
                <Modal onChoice={this.loadVideo} onCancel={this.closeModal} open={this.state.modalOpen}></Modal>   
                <input accept="image/*" type="file" ref={this.imageRef} style={{ display: 'none' }} />
                <input accept="video/mp4,video/mkv,video/x-m4v,video/*" type="file" ref={this.videoRef} style={{ display: 'none' }} />

                <List items={items} addItem={this.addItem}></List>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        layer: state.items.layers[state.items.selectedLayerId]
    }
}

export default connect(mapStateToProps)(withHeader(Previews))
