import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button'
import Delete from 'material-ui-icons/Delete';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';


import { connect } from 'react-redux'
import {  setSidebarWindowIndex, selectEffect, removeEffect } from '../../../redux/actions/items'

const styles = theme => ({
  root: {
    height: "calc(100% - 78px)", // height of the header/appbar
    width: '100%',
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll"
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

class EffectList extends React.Component {
    back = () => {
        setSidebarWindowIndex(this.props.idxs.LAYER)
    }

    removeItem = (effect) => {
        removeEffect(effect)
    }

    render() {
        const { classes, passes } = this.props;

        return (
            <div className={classes.root}>
                <div style={{display: "flex", flexFlow: "row wrap", flexDirection: "row"}}>
                    {passes.map( (pass, i) => {
                        return( 
                            <div key={pass.id} style={{width: "100%", display: "flex", flexDirection: "row", textAlign: "right", overflow: "hidden",}}>
                                <Button variant="raised" fullWidth onClick={() => selectEffect(pass.id)}> {pass.name} </Button>
                                <div style={{display: "flex", flexDirection: "row"}}>

                                    <Button style={{minWidth: 10, width: 10}} disabled={i === 0 || passes[i-1].renderPass} disableRipple>
                                        <KeyboardArrowUp ></KeyboardArrowUp>
                                    </Button>
                                    <Button style={{minWidth: 10, width: 10}} disabled={i === 0 || i === passes.length - 1} disableRipple>
                                        <KeyboardArrowDown ></KeyboardArrowDown>
                                    </Button>

                                    <Button style={{minWidth: 10, width: 10}} disabled={pass.renderPass} >
                                        <Delete onClick={() => this.removeItem(pass)}></Delete>
                                    </Button>
                                </div>
                            </div>
                        )
                    } 
                    )}
                </div>
            </div>
        );
    }
}

EffectList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        passes: state.items.passes[state.items.selectedLayerId],
        postProcessingEnabled: state.items.layers[state.items.selectedLayerId].postProcessingEnabled
    }
}

export default connect(mapStateToProps)(withStyles(styles)(EffectList)) 