import React from 'react';
import PropTypes from 'prop-types';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { setSidebarWindowIndex, createEffect } from '@redux/actions/items'

import withHeader from '../withheader'


class NewEffect extends React.Component {

    back = () => {
        setSidebarWindowIndex(this.props.idxs.LAYER)
    };

    createEffect = (type) => {
        createEffect(type)
    }


  render() {
    const { classes } = this.props;

    return (
        <List>  
            {["Sepia", "Glitch", "Anti Alias", "Bloom", "RGB Halftone"].map(e => (
                <ListItem key={e} dense button className={classes.listItem}>
                    <ListItemText primary={e} onClick={() => this.createEffect(e.toUpperCase())}/>
                </ListItem>
            ))} 
        </List>
    );
  }
}

NewEffect.propTypes = {
  classes: PropTypes.object.isRequired,
};



export default withHeader(NewEffect)