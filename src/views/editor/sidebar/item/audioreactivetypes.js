import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem,  ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button'
import { setSidebarWindowIndex, createItem } from '@redux/actions/items'

import {connect} from 'react-redux'

const styles = theme => ({
  root: {
    height: "100%", // height of the header/appbar
    width: '100%',
    display: "flex", 
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: theme.palette.background.paper,
  },
});

class AudioReactiveTypeList extends React.Component {  
  setWindow = () => {
    this.props.setWindow(4)
  };

  add = (itemName) => {
    createItem({type: itemName.toUpperCase()})
  }

  back = () => {
    setSidebarWindowIndex(this.props.idxs.ADDRESOURCEOPTIONS)
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div>
        <List>
          {["Bars", "Text3D", "Water", "Tesselated Text", "Sphere", "Random Geometry", "Particles"].map(value => (
            <ListItem key={value} dense button className={classes.listItem} onClick={() => this.add(value)}>
              <ListItemText primary={value} />
            </ListItem>
          ))}
        </List>
        </div>
        <Button variant="raised" fullWidth onClick={this.back}>
            Back
        </Button>
      </div>
    );
  }
}

AudioReactiveTypeList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    items: state.items.items
  }
}

export default connect(mapStateToProps)(withStyles(styles)(AudioReactiveTypeList) )