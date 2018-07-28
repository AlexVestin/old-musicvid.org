import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import ScrollArea2 from './scrollarea2'

import classes from './playlist.css'
import { connect } from 'react-redux'

class SimpleTabs extends React.PureComponent {
    state = {
        tabValue: 0,
        contentValue: 0,
    };


    handleChange = (event, value) => {
        this.setState({tabValue: value})
    };

    
    render() {
        const value = this.props.sideBarWindowIndex

        if(value <= 2)
            this.tabValue = value

        return (
            <div className={classes.wrapper} >
                <div className={classes.header} style={{minHeight: 12, height: 12, backgroundColor: "#434343"}}></div>
                <div className={classes.scrollbarWrapper}>
                    <ScrollArea2 maxNrUnits={this.props.clipDuration} items={this.props.items}> </ScrollArea2>
                </div>
            </div>
        );
    }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        selectedItem: state.items.selectedItem,
        items: state.items.items,
        clipDuration: state.globals.clipDuration
    }
}

export default connect(mapStateToProps)(withStyles(classes)(SimpleTabs));
