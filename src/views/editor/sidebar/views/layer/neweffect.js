import React from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { setSidebarWindowIndex, createEffect } from '@redux/actions/items'
import withHeader from '../../HOC/withheadereffectstemp'



const effects = [
    "Sepia", 
    "Glitch", 
    "RGB Halftone",
    "Pixel"
]

class NewEffect extends React.Component {

    back = () => {
        setSidebarWindowIndex(this.props.idxs.LAYERS)
    };

    createEffect = (type) => {
        createEffect(type)
    }


  render() {
    return (
        <List>  
            {effects.map(e => (
                <ListItem disableRipple key={e} dense button >
                    <ListItemText primary={e} onClick={() => this.createEffect(e.toUpperCase())}/>
                </ListItem>
            ))} 
        </List>
    );
  }
}



export default withHeader(NewEffect)