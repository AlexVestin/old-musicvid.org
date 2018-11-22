import React from 'react';
import { connect } from 'react-redux'
import { selectLayer, dispatchAction, setSidebarWindowIndex } from '@redux/actions/items'
import withHeader from '../../HOC/withheader'
import Delete from '@material-ui/icons/Delete'
import EffectList from './effects'
import GroupContainer from '../../input/groupcontainer'
import classes from '../item/items.css'

import ConfigList from '../../input/input'
class LayerList  extends React.Component {

  onClick = (layer) => {
    selectLayer(layer.id)
  }

  create2DLayer = () =>  {
    dispatchAction( { type: "CREATE_2D_LAYER" })
  }

  create3DLayer = () =>  {
    dispatchAction( { type: "CREATE_3D_LAYER" })
  }

  removeItem = (layer) => {
    dispatchAction({type: "REMOVE_LAYER", payload: layer})
  }

  render() {
    const { layers } = this.props;
    const sortedItems = Object.keys(layers).map(key => layers[key])
    const quickConfigGroups = [{
      title: "Quickconfigs",
      items: this.props.quickConfigs.map(c=>c)
    }]

    return (
      <div className={classes.root}>


          <GroupContainer label={"Layers"} expanded>
            <div style={{display: "flex", flexFlow: "row wrap", flexDirection: "row"}}>
                <div style={{backgroundColor: "rgb(231, 231, 231)", height: 20, width: "100%", display:"flex", justifyContent: "flex-end"}}>
                    <div style={{ display:"flex", flexDirection: "row"}}>
                      <div onClick={this.create2DLayer} className={classes.button} style={{width: 30, height:20, minWidth: 20, minHeight: 20}}>+2D</div>
                      <div onClick={this.create3DLayer} className={classes.button} style={{width: 30, height:20, minWidth: 20, minHeight: 20, marginLeft: 5}}>+3D</div>
                    </div>
                </div>

                

                {sortedItems.map((item, i) => {
                  return( 
                      <div key={item.id} className={classes.wrapper}>
                          <div className={classes.listitem} onClick={() => this.onClick(item)}> <div className={classes.itemName}>{item.name}</div>  </div>
                          <div className={classes.listitemContainer}>
                            <div className={classes.button}  onClick={() => this.removeItem(item)}>
                                <Delete className={classes.icon}></Delete>
                            </div>
                          </div>
                      </div>
                    )
                } 
                )}
                </div>
            </GroupContainer>

            <GroupContainer label={"Effects"} addAction={() => setSidebarWindowIndex(this.props.idxs.NEWEFFECT)}>
                <EffectList idxs={this.props.idxs}></EffectList>
            </GroupContainer> 

             
       </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    layers: state.items.layers,
    quickConfigs: state.globals.quickConfigs
  }
}
export default connect(mapStateToProps)(withHeader(LayerList))

