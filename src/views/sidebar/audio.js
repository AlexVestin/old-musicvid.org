import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem } from 'material-ui/List';

import Button from 'material-ui/Button'
import Delete from 'material-ui-icons/Delete';
import TextField from 'material-ui/TextField';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import { connect } from 'react-redux'
import { addSound, setSidebarWindowIndex } from '../../redux/actions/items'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  textField: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    width: 80,
  },

  listItem: {
      height: 50,
      minHeight: 50
  }
});

class Audio extends React.Component {

    componentDidMount() {
        this.fileInputRef.onchange = () => {
            let file = this.fileInputRef.files[0]
            let name =  this.fileInputRef.files[0].name
            addSound({type:"SOUND", file, name})
        }
    }

    setWindow = () => {
        //this.props.setWindow(4)
    };

    back = () => {
        setSidebarWindowIndex(this.props.idxs.ITEMS)
    }

    render() {
        const { classes, audioInfo } = this.props;
        return (
            <div className={classes.root}>
            <input accept="audio/*" type="file" ref={(ref) => this.fileInputRef = ref} style={{ display: 'none' }} />
             
            {audioInfo !== null ? null : <Button fullWidth variant="raised" onClick={() => this.fileInputRef.click()}>load audio</Button>
        }
        </div>
        );
    }
}

Audio.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        audioInfo: state.items.audioInfo
    }
}

export default connect(mapStateToProps)(withStyles(styles)(Audio)) 