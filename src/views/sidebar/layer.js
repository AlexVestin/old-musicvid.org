import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem } from 'material-ui/List';

import Button from 'material-ui/Button'
import Delete from 'material-ui-icons/Delete';
import TextField from 'material-ui/TextField';

import AppBar from 'material-ui/AppBar';



import { connect } from 'react-redux'
import { editItem, setSidebarWindowIndex, removeItem } from '../../redux/actions/items'

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "calc(100% - 78px)", // height of the header/appbar
    width: '100%',
    
    margin: 0,
  },
  textField: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    width: 80,
  },

  listItem: {
      height: 50,
  }
});

class Layer extends React.Component {


    back = () => {
        setSidebarWindowIndex(this.props.idxs.LAYERS)
    };

    openItems = (e) => {
        setSidebarWindowIndex(this.props.idxs.ITEMS)
    }

        
    render() {
        const { classes, sideBarWindowIndex } = this.props;
        const conf = this.props.selectedLayer;
        const idxs = this.props.idxs

        return (
            <div className={classes.root}>
            <div>
                <Button variant="raised" fullWidth onClick={this.openItems}>
                    Items
                </Button>
                <Button disabled variant="raised" fullWidth onClick={this.setWindow}>
                    Camera
                </Button>
                <Button disabled variant="raised" fullWidth onClick={this.setWindow}>
                    Controls
                </Button>
                <Button disabled variant="raised" fullWidth onClick={this.setWindow}>
                    Scene
                </Button>
            
                </div>
                <Button variant="raised" fullWidth onClick={this.back}>
                    Back
                </Button>
            </div>
        );
    }
}




Layer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        selectedLayer: state.items.selectedLayer,
        sideBarWindowIndex: state.items.sideBarWindowIndex
    }
}

export default connect(mapStateToProps)(withStyles(styles)(Layer)) 