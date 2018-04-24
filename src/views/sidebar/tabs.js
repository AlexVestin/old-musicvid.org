import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';

import { connect } from 'react-redux'

import AddResourceOptions from './newresource'
import AddLayerOptions from './newlayer'

import AudioReactiveTypeList from './audioreactivetypes'
import ResourceList from "./resources"
import LayerList from './layers'

import { setSidebarWindowIndex } from '../../redux/actions/items'
import Item from './item'

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
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class SimpleTabs extends React.Component {
    state = {
        tabValue: 0,
        contentValue: 0,
    };

    handleChange = (event, value) => {
        setSidebarWindowIndex(value)
    };

    render() {
        const { classes } = this.props;
        const value = this.props.sideBarWindowIndex
        const tabStyle = { minWidth: "30px", maxWidth: "100px" }
        if(value <= 2)
            this.tabValue = value

        return (
            <div className={classes.root}>
                <AppBar position="static" >
                    <Tabs value={this.tabValue} onChange={this.handleChange} fullWidth>
                        <Tab label="Resources" style={tabStyle}/>
                        <Tab label="Effects" style={tabStyle}/>
                        <Tab label="Layers" style={tabStyle} href="#basic-tabs" />
                    </Tabs>
                </AppBar>
                
                {value === 0 && <ResourceList ></ResourceList>}
                {value === 1 && <TabContainer >effects will go here</TabContainer>}
                {value === 2 && <LayerList ></LayerList>}
                {value === 3 && <AddResourceOptions ></AddResourceOptions>}
                {value === 4 && <AddLayerOptions ></AddLayerOptions>}
                {value === 5 && <AudioReactiveTypeList ></AudioReactiveTypeList>}
                {value === 6 && <Item item={this.props.selectedItem}></Item>}
            
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
        sideBarWindowIndex: state.items.sideBarWindowIndex
    }
}

export default connect(mapStateToProps)(withStyles(styles)(SimpleTabs));
