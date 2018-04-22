import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';

import { connect } from 'react-redux'

import { setSidebarWindowIndex } from '../../redux/actions/items'

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    minHeight: 30,
    height: 30,
    
  },
});

class SimpleTabs extends React.PureComponent {
    state = {
        tabValue: 0,
        contentValue: 0,
    };

    handleChange = (event, value) => {
        this.setState({tabValue: value})
    };

    render() {
        const { classes } = this.props;
        const value = this.props.sideBarWindowIndex
        const tabStyle = { minWidth: "30px", maxWidth: "100px", minHeight: "30px", height: "20px", maxHeight: "20px" }
        if(value <= 2)
            this.tabValue = value

        return (
            <div className={classes.root}>
                <AppBar position="static" >
                    <Tabs value={this.state.tabValue} onChange={this.handleChange} fullWidth>
                        <Tab label="Items" style={tabStyle}/>
                        <Tab label="Automations" style={tabStyle}/>
                    </Tabs>
                </AppBar>
        
            </div>
        );
    }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        selectedItem: state.selectedItem,
        items: state.items,
    }
}

export default connect(mapStateToProps)(withStyles(styles)(SimpleTabs));
