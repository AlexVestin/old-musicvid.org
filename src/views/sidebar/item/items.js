import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';

import Button from 'material-ui/Button'

import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';

import { connect } from 'react-redux'
import { selectItem, setSidebarWindowIndex } from '../../../redux/actions/items'


const styles = theme => ({
  root: {
    height: "calc(100% - 78px)", // height of the header/appbar
    width: '100%',
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: theme.palette.background.paper,
  },
});

class ResourceList extends React.Component {

  setWindow = () => {
    setSidebarWindowIndex(this.props.idxs.ADDRESOURCEOPTIONS)
  };

  selectItem = (obj) => {
    selectItem(obj.id)
  }

  back = () => {
    setSidebarWindowIndex(this.props.idxs.LAYER)
  }

  render() {
    const { classes, selectedLayerId } = this.props;
    const items = this.props.items[selectedLayerId]
    return (
      <div className={classes.root}>
        <List>
          {items !== undefined && Object.keys(items).map(key => 
            <ListItem key={items[key].id} dense button className={classes.listItem} onClick={() => this.selectItem(items[key])}>
              <ListItemText primary={items[key].name} />
              <ListItemSecondaryAction>
                    <IconButton aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
         )}

            
             
        </List>
        <div>
          <Button variant="raised" color="primary" fullWidth onClick={this.setWindow}>
                  Add New Item
          </Button>
          <Button variant="raised" fullWidth onClick={this.back}>
              Back
          </Button>
        </div>
      </div>
    );
  }
}

ResourceList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    items: state.items.items,
    selectedLayerId: state.items.selectedLayerId,

  }
}

export default connect(mapStateToProps)(withStyles(styles)(ResourceList))