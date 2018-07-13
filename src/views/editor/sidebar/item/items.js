import React from 'react';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';

import { connect } from 'react-redux'
import { selectItem, setSidebarWindowIndex } from '@redux/actions/items'


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
    const { selectedLayerId } = this.props;
    const items = this.props.items[selectedLayerId]

    return (
        <List>
          {items !== undefined && Object.keys(items).map(key => 
            <ListItem key={items[key].id} dense button  onClick={() => this.selectItem(items[key])}>
              <ListItemText primary={items[key].name} />
              <ListItemSecondaryAction>
                    <div >
                    </div>
              </ListItemSecondaryAction>
            </ListItem>
         )}
        </List>
    );
  }
}


const mapStateToProps = state => {
  return {
    items: state.items.items,
    selectedLayerId: state.items.selectedLayerId,
    layers: state.items.layers

  }
}

export default connect(mapStateToProps)(ItemList)