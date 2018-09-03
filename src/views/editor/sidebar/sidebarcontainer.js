import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { connect } from 'react-redux'

import Audio from './audio'
import LayerList from './layer/layers'
import ProjectSettings from './input/projectsettings'
import LayerContainer from './layer/layercontainer'

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
    height: "100%",
    width: "100%",
    overflow: "hidden"
  },
});

class SidebarContainer extends React.Component {
    static INDEXES = {
        LAYERS: 0,
        AUDIO: 1,
        PROJECTSETTINGS: 2,
        ADDRESOURCEOPTIONS: 3,
        ADDLAYEROPTIONS: 4,
        ITEM: 5,
        AUDIOREACTIVETYPELIST: 6,
        LAYER: 7,
        ITEMS: 8,
        EFFECT: 9,
        NEWEFFECT: 10,
        ADDRESOURCEOPTIONS2D: 11,
    }

    render() {
        const { classes } = this.props;
        const value = this.props.sideBarWindowIndex
        const INDEXES = SidebarContainer.INDEXES

        return (
            <div className={classes.root}>
                {value === INDEXES.PROJECTSETTINGS && <ProjectSettings idxs={INDEXES} idx={2}></ProjectSettings>}
                {value === INDEXES.LAYERS && <LayerList idx={0} idxs={INDEXES} ></LayerList>}
                {value === INDEXES.AUDIO && <Audio idxs={INDEXES} idx={INDEXES.AUDIO}></Audio>}
                {value >= 2 && <LayerContainer idxs={INDEXES} ></LayerContainer>}
            </div>
        );
    }
}

SidebarContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        selectedItemId: state.items.selectedItemId,
        sideBarWindowIndex: state.items.sideBarWindowIndex,
        selectedLayerId: state.items.selectedLayerId,      
    }
}

export default connect(mapStateToProps)(withStyles(styles)(SidebarContainer));