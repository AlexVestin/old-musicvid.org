import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';


import { connect } from 'react-redux'
import { selectItem, setSidebarWindowIndex } from '@redux/actions/items'


const styles = theme => ({
  root: {
    height: "100%", // height of the header/appbar
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class ItemList extends React.Component {

  setWindow = () => {
    setSidebarWindowIndex(this.props.idxs.ADDRESOURCEOPTIONS)
  };

  selectItem = (obj) => {
    selectItem({itemId: obj.id, layerId: obj.sceneId})
  }

  back = () => {
    setSidebarWindowIndex(this.props.idxs.LAYER)
  }

  render() {
    const { classes, selectedLayerId } = this.props;
    const items = this.props.items[selectedLayerId]

    const myItems = this.props.layers[selectedLayerId].items.map(id => this.props.items[id])
    return (
      <div className={classes.root}>
        <List>
          {items !== undefined && Object.keys(items).map(key => 
            <ListItem key={items[key].id} dense button className={classes.listItem} onClick={() => this.selectItem(items[key])}>
              <ListItemText primary={items[key].name} />
              <ListItemSecondaryAction>
                    <div >
                    </div>
              </ListItemSecondaryAction>
            </ListItem>
         )}
        </List>
      </div>
    );
  }
}

ItemList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    items: state.items.items,
    selectedLayerId: state.items.selectedLayerId,
    layers: state.items.layers

  }
}

export default connect(mapStateToProps)(withStyles(styles)(ItemList))