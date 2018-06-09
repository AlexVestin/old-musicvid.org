import React from 'react';
import PropTypes from 'prop-types';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { setSidebarWindowIndex, createEffect } from '@redux/actions/items'

import withHeader from '../withheader'


const effects = [
    "Sepia", 
    "Glitch", 
    "Anti Alias",
    "Bloom", 
    "RGB Halftone",
    "Color Shader"
]

class NewEffect extends React.Component {

    back = () => {
        setSidebarWindowIndex(this.props.idxs.LAYER)
    };

    createEffect = (type) => {
        createEffect(type)
    }


  render() {
    console.log(this.props)
    return (
        <List>  
            {effects.map(e => (
                <ListItem key={e} dense button >
                    <ListItemText primary={e} onClick={() => this.createEffect(e.toUpperCase())}/>
                </ListItem>
            ))} 
        </List>
    );
  }
}



export default withHeader(NewEffect)