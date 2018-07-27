import React from 'react';
import  withHeader from '../withheader';
import List, { ListItem, ListItemText } from 'material-ui/List';

import { createItem, setSidebarWindowIndex } from '@redux/actions/items'
import { connect } from 'react-redux'
import Modal from '../modal'

class AddResourceOptions extends React.Component {

    constructor(props) {
        super(props)
        this.state = {modalOpen: false}
    }

    back = () => {
        console.log("BACK???")
        setSidebarWindowIndex(this.props.idxs.LAYER)
    };

    componentDidMount() {

        let add = (type, input) => {
            let file = input.files[0]
            let name = input.files[0].name

            createItem({type, file, name, keepAudio: this.keepAudio})
        }

        this.uploadImage.onchange = () => {
            add("IMAGE", this.uploadImage)
        }

        this.uploadVideo.onchange = () => {
            add("VIDEO", this.uploadVideo)
        }
    }

    loadVideo = (keepAudio) => {
        this.uploadVideo.click();
        this.keepAudio = keepAudio
        this.setState({modalOpen: false})
    }

    add = (e) => {
        switch(e) {
            case 1:
                this.uploadImage.click()
                break;
            case 2:
                this.setState({modalOpen: true})
                break;
            case 4:
                setSidebarWindowIndex(this.props.idxs.AUDIOREACTIVETYPELIST)
                break;
            default:
                console.log("unknown click type")
        }
    }

  render() {

    return (
      <div >
        <input accept="image/*" type="file" ref={(ref) => this.uploadImage = ref} style={{ display: 'none' }} />
        <input accept="video/mp4,video/mkv,video/x-m4v,video/*" type="file" ref={(ref) => this.uploadVideo = ref} style={{ display: 'none' }} />

        <Modal onChoice={this.loadVideo} onCancel={() => this.setState({modalOpen: false})} open={this.state.modalOpen}></Modal>   

        <List>
            <ListItem disableRipple dense button >
                <ListItemText primary={`Add image`} onClick={() => this.add(1)}/>
            </ListItem>

            <ListItem disableRipple dense button onClick={() => this.add(2)}>
                <ListItemText primary={`Add Video`} />
            </ListItem>

            <ListItem disableRipple dense button onClick={() => this.add(4)}>
                <ListItemText primary={`3D items`} />
            </ListItem>            
        </List>
      </div>
    );
  }
}


const mapStateToProps = state => {
    return {
        items: state.items.items,
        layer: state.items.layers[state.items.selectedLayerId]
    }
}

export default connect(mapStateToProps)(withHeader(AddResourceOptions))