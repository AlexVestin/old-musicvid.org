import React from 'react';
import withHeader from '../../HOC/withheader';
import List, { ListItem, ListItemText } from '@material-ui/core/List';
import Button from '@material-ui/core/Button'

class AddLayerOptions extends React.Component {
    back = () => {
        this.props.back()
    };

    upload = (e) => {
        switch(e) {
            case 0:
                this.uploadSound.click()
                break;
            case 1:
                console.log("adding image")
                break;
            case 2:
                console.log("adding video")
                break;
            default:
                console.log("unknown click type")
        }
    }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <input type="file" ref={(ref) => this.uploadSound = ref} style={{ display: 'none' }} />
        <input type="file" ref={(ref) => this.uploadImage = ref} style={{ display: 'none' }} />
        <input type="file" ref={(ref) => this.uploadVideo = ref} style={{ display: 'none' }} />
                        
        <List>
            <ListItem disableRipple  dense button className={classes.listItem}>
                <ListItemText primary={`Add sound`} onClick={() => this.upload(0)}/>
            </ListItem>

            <ListItem disableRipple  dense button className={classes.listItem}>
                <ListItemText primary={`Add background image`} onClick={() => this.upload(1)}/>
            </ListItem>

            <ListItem disableRipple  dense button className={classes.listItem} onClick={() => this.upload(2)}>
                <ListItemText primary={`Add Video`} />
            </ListItem>

            <ListItem  disableRipple dense button className={classes.listItem}>
                <ListItemText primary={`Add Audio Reactive Item`} />
            </ListItem>

            <ListItem dense button className={classes.listItem}>
                <ListItemText primary={`Add Text`} />
            </ListItem>

          <ListItem disableRipple  dense button className={classes.listItem}>
            <Button variant="raised" fullWidth onClick={this.back}>
                Back
            </Button>
            </ListItem>
        </List>
      </div>
    );
  }
}
;

export default withHeader(AddLayerOptions)