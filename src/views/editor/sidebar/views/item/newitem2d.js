import React from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { createItem, setSidebarWindowIndex } from '@redux/actions/items'
import { connect } from 'react-redux'
import  withHeader from '../../HOC/withheader';
import Modal from '../../modals/modal'

class AddResourceOptions2D extends React.Component {

    constructor(props) {
        super(props)
        this.state = {modalOpen: false}
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

        this.uploadImage.onchange = () => {
            add("IMAGE", this.uploadImage)
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

            <ListItem disableRipple dense button onClick={() => this.add(4)}>
                <ListItemText primary={`Items`} />
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

export default connect(mapStateToProps)(withHeader(AddResourceOptions2D))