import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';

import Button from 'material-ui/Button'
import { createItem, setSidebarWindowIndex } from '../../redux/actions/items'
import { connect } from 'react-redux'

import Modal from './modal'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 330,
    backgroundColor: theme.palette.background.paper,
  },
});

class AddResourceOptions extends React.Component {

    constructor(props) {
        super(props)

        this.state = {modalOpen: false}

    }
    back = () => {
        setSidebarWindowIndex(0)
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

        this.uploadSound.onchange = () => {
            add("SOUND", this.uploadSound)
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
            case 0:
                this.uploadSound.click()
                break;
            case 1:
                this.uploadImage.click()
                break;
            case 2:
                this.setState({modalOpen: true})
                
                break;
            case 3:
                console.log("add 2d text")
                break;
            case 4:
                setSidebarWindowIndex(5)
                break;
            default:
                console.log("unknown click type")
        }
    }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <input accept="audio/*" type="file" ref={(ref) => this.uploadSound = ref} style={{ display: 'none' }} />
        <input accept="image/*" type="file" ref={(ref) => this.uploadImage = ref} style={{ display: 'none' }} />
        <input accept="video/mp4,video/mkv,video/x-m4v,video/*" type="file" ref={(ref) => this.uploadVideo = ref} style={{ display: 'none' }} />

        <Modal onChoice={this.loadVideo} onCancel={() => this.setState({modalOpen: false})} open={this.state.modalOpen}></Modal>        
        <List>
            <ListItem dense button className={classes.listItem}>
                <ListItemText primary={`Add sound`} onClick={() => this.add(0)}/>
            </ListItem>

            <ListItem dense button className={classes.listItem}>
                <ListItemText primary={`Add background image`} onClick={() => this.add(1)}/>
            </ListItem>

            <ListItem dense button className={classes.listItem} onClick={() => this.add(2)}>
                <ListItemText primary={`Add Video`} />
            </ListItem>
            
            <ListItem dense button className={classes.listItem} onClick={() => this.add(3)}>
                <ListItemText primary={`Foreground text`} />
            </ListItem>


            <ListItem dense button className={classes.listItem} onClick={() => this.add(4)}>
                <ListItemText primary={`3D items`} />
            </ListItem>

          <ListItem dense button className={classes.listItem}>
            <Button variant="raised" fullWidth onClick={this.back}>
                Back
            </Button>
            </ListItem>
        </List>
      </div>
    );
  }
}

AddResourceOptions.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        items: state.items.items
    }
}

export default connect(mapStateToProps)(withStyles(styles)(AddResourceOptions ))