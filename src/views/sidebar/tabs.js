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

    handleChange = (event, tabValue) => {
        this.setState({ tabValue, contentValue: tabValue });
    };

    back = () => {
        this.setWindow(this.lastValue)
    }

    setWindow = (value) => {
        this.lastValue = this.state.contentValue
        if(value <= 2){
            this.setState({tabValue: value, contentValue: value})
        }else{
            this.setState({contentValue: value})
        }
    }

    render() {
        const { classes } = this.props;
        const value = this.state.contentValue
        const tabStyle = { minWidth: "30px", maxWidth: "100px" }

        return (
            <div className={classes.root}>
                <AppBar position="static" >
                    <Tabs value={this.state.tabValue} onChange={this.handleChange} fullWidth>
                        <Tab label="Resources" style={tabStyle}/>
                        <Tab label="Effects" style={tabStyle}/>
                        <Tab label="Layers" style={tabStyle} href="#basic-tabs" />
                    </Tabs>
                </AppBar>
                
                {value === 0 && <ResourceList setWindow={this.setWindow}></ResourceList>}
                {value === 1 && <TabContainer >effects will go here</TabContainer>}
                {value === 2 && <LayerList setWindow={this.setWindow}></LayerList>}
                {value === 3 && <AddResourceOptions back={this.back} setWindow={this.setWindow}></AddResourceOptions>}
                {value === 4 && <AddLayerOptions back={this.back}></AddLayerOptions>}
                {value === 5 && <AudioReactiveTypeList back={this.back} setWindow={this.setWindow}></AudioReactiveTypeList>}
                {value === 6 && <Item back={this.back} item={this.props.selectedItem}></Item>}
            
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
        items: state.items
    }
}

export default connect(mapStateToProps)(withStyles(styles)(SimpleTabs));


/*
           let item = {name: "Bars", color: "FFFFFF", strength: 1, layer: "Scene", centerX: 0, centerY: 0, type: "BARS"}
                appendItem(item)*/