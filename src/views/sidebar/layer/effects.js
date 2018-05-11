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
    justifyContent: "space-between",
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

class EffectList extends React.Component {

    constructor() {
        super()
        this.state = {values: {}}
    }

    setWindow = () => {
        //this.props.setWindow(4)
    };

    back = () => {
        setSidebarWindowIndex(this.props.idxs.LAYER)
    }

    removeItem = (effect) => {
        removeEffect(effect)
    }

    render() {
        const { classes } = this.props;
        const passes = this.props.selectedLayer.passes
        const idxs = this.props.idxs

        return (
            <div className={classes.root}>
                <div>
                    <div style={{display: "flex", flexFlow: "row wrap", flexDirection: "row"}}>
                        {passes.map( (e, i) => {
                            return( 
                                <div key={e.id} style={{width: "100%", display: "flex", flexDirection: "row", textAlign: "right", overflow: "hidden",}}>
                                    <Button variant="raised" fullWidth onClick={() => selectEffect(e)}> {e.name} </Button>
                                        <div style={{display: "flex", flexDirection: "row"}}>

                                            <Button style={{minWidth: 10, width: 10}} disabled={i === 0 || passes[i-1].renderPass}>
                                                <KeyboardArrowUp></KeyboardArrowUp>
                                            </Button>
                                            <Button style={{minWidth: 10, width: 10}} disabled={i === 0 || i === passes.length - 1} >
                                                <KeyboardArrowDown ></KeyboardArrowDown>
                                            </Button>

                                            <Button style={{minWidth: 10, width: 10}} disabled={e.renderPass} >
                                                <Delete onClick={() => this.removeItem(e)}></Delete>
                                            </Button>
                                        </div>
                                
                                    
                                </div>
                            )
                        } 
                        )}
                    </div>
                </div>
                    <div> 
                        <Button onClick={() => setSidebarWindowIndex(idxs.NEWEFFECT)} fullWidth color="primary" variant="raised"> Add new effect</Button>
                        <Button variant="raised" fullWidth onClick={this.back}>
                            Back
                        </Button>
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
        selectedLayer: state.items.selectedLayer
    }
}

export default connect(mapStateToProps)(withStyles(styles)(EffectList)) 