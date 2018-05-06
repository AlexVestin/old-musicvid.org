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
import Tooltip from 'material-ui/Tooltip';


import { connect } from 'react-redux'
import { editItem, setSidebarWindowIndex, removeItem } from '../../../redux/actions/items'

const styles = theme => ({
  root: {
    height: "calc(100% - 78px)", // height of the header/appbar
    width: '100%',
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  textField: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    width: 75,
  },

  listItem: {
      height: 50,
      minHeight: 50
  }
});

class RenderTarget extends React.Component {

    constructor() {
        super()
        this.state = {values: {}}
    }

    setWindow = () => {
        //this.props.setWindow(4)
    };

    back = () => {
        setSidebarWindowIndex(this.props.idxs.RENDERTARGETS)
    }

    handleChange = input => event => {
      
    }

    setInputValues = (props) => {
      
    }

    removeItem = () => {
        removeItem(this.props.selectedItem)
    }

    componentWillMount(props) {
        this.setInputValues(this.props)
    }
        
    componentWillReceiveProps(props) {
        this.setInputValues(props)
    } 

    render() {
        const { classes } = this.props;
        const config = this.props.selectedRenderTarget

        return (
            <div className={classes.root}>
                <div>
                    <div style={{display: "flex", flexFlow: "row wrap", flexDirection: "row"}}>

                    </div>
                </div>
                    <div> 
                        <Button disabled={config.isMain} className={classes.button} style={{marginLeft: "auto"}} fullWidth onClick={this.removeItem} variant="raised" color="secondary">
                            Remove rendertarget
                            <Delete  className={classes.rightIcon} />
                        </Button>               
                        <Button variant="raised" fullWidth onClick={this.back}>
                            Back
                        </Button>
                    </div>
            </div>
        );
    }
}

RenderTarget.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        selectedRenderTarget: state.items.selectedRenderTarget
    }
}

export default connect(mapStateToProps)(withStyles(styles)(RenderTarget)) 