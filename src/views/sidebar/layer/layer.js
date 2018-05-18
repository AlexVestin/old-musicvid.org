import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'

import { connect } from 'react-redux'
import { setSidebarWindowIndex } from '../../../redux/actions/items'

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

    openCamera = (e) => {
        setSidebarWindowIndex(this.props.idxs.CAMERA)
    }

        
    render() {
        const { classes } = this.props;
        const idxs = this.props.idxs
        return (
            <div className={classes.root}>
            <div>
                <Button variant="raised" fullWidth onClick={this.openItems}>
                    Items
                </Button>
                <Button variant="raised" fullWidth onClick={this.openCamera}>
                    Camera
                </Button>
                <Button disabled variant="raised" fullWidth onClick={this.setWindow}>
                    Controls
                </Button>
                <Button disabled variant="raised" fullWidth onClick={this.setWindow}>
                    Scene
                </Button>
                {this.props.postProcessingEnabled ? 
                <Button variant="raised" fullWidth onClick={() => setSidebarWindowIndex(idxs.EFFECTS)}>Effects</Button> : 
                <Tooltip id="tooltip-top-start" title="Post processing must be enabled in the project settings" placement="right-end">
                    <div style={{height: 36, width: "100%", backgroundColor: "#E0E0E0", textAlign: "center", color: "#A6A6A6", verticalAlign: "middle", lineHeight: 2}}>Effects</div>
                </Tooltip>
            }
                
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
        sideBarWindowIndex: state.items.sideBarWindowIndex,
        postProcessingEnabled: state.items.postProcessingEnabled
    }
}

export default connect(mapStateToProps)(withStyles(styles)(Layer)) 