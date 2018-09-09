import React from 'react';
import { connect } from 'react-redux'
import Delete from '@material-ui/icons/Delete';
import { selectItem, removeItem, dispatchAction } from '@redux/actions/items'
import classes from './items.css'

class ItemList extends React.Component {


  selectItem = (obj) => {
    selectItem({itemId: obj.id, layerId: obj.sceneId})
  }

  removeItem = (item) => {
    removeItem(item)
  }

  moveItem = (item, up) => {
    dispatchAction({type: "MOVE_ITEM", payload: { item, up }})
  }


  render() {
      const {  layerItems, items } = this.props;
      const sortedItems = layerItems.map(key => items[key])

      return (
          <div>
              <div style={{display: "flex", flexFlow: "row wrap", flexDirection: "row"}}>
                  {sortedItems.map((item, i) => {
                    return( 
                        <div key={item.id} className={classes.wrapper}>
                            <div className={classes.listitem} onClick={() => this.selectItem(item)}> <div className={classes.itemName}>{item.name}</div>  </div>
                            <div className={classes.listitemContainer}>
                              <div className={classes.button}  onClick={this.removeItem}>
                                  <Delete className={classes.icon}></Delete>
                              </div>
                            </div>
                        </div>
                      )
                  } 
                  )}
              </div>
          </div>
      );
  }
}

const mapStateToProps = state => {
  return {
    layerItems: state.items.layers[state.items.selectedLayerId].items,
    items: state.items.items[state.items.selectedLayerId]
  }
}

export default connect(mapStateToProps)(ItemList)