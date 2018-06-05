import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';

import Button from 'material-ui/Button'
import { setSidebarWindowIndex, createEffect } from '../../../redux/actions/items'

const styles = theme => ({
  root: {
    height: "calc(100% - 48px)", // height of the header/appbar
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class NewEffect extends React.Component {

    back = () => {
        setSidebarWindowIndex(this.props.idxs.EFFECTS)
    };

    createEffect = (type) => {
        createEffect(type)
    }


  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
            <List>  
                {["Sepia", "Glitch", "Anti Alias", "Bloom"].map(e => (
                    <ListItem key={e} dense button className={classes.listItem}>
                        <ListItemText primary={e} onClick={() => this.createEffect(e.toUpperCase())}/>
                    </ListItem>
                ))} 
            </List>
      </div>
    );
  }
}

NewEffect.propTypes = {
  classes: PropTypes.object.isRequired,
};



export default withStyles(styles)(NewEffect)