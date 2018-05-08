import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';

import Button from 'material-ui/Button'
import { setSidebarWindowIndex, createEffect } from '../../../redux/actions/items'
import { connect } from 'react-redux'

const styles = theme => ({
  root: {
    height: "calc(100% - 78px)", // height of the header/appbar
    width: '100%',
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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
                <ListItem dense button className={classes.listItem}>
                    <ListItemText primary={`Sepia`} onClick={() => this.createEffect("SEPIA")}/>
                </ListItem>

                <ListItem dense button className={classes.listItem} onClick={() => this.createEffect("GLITCH")}>
                    <ListItemText primary={`Glitch`} />
                </ListItem>
                
                <ListItem dense button className={classes.listItem} onClick={() => this.createEffect("ANTI ALIAS")}>
                    <ListItemText  primary={`Anti Alias`} />
                </ListItem>


                <ListItem dense button disabled className={classes.listItem} onClick={() => this.createEffect("")}>
                    <ListItemText primary={`3D items`} />
                </ListItem>
            </List>

            <Button variant="raised" fullWidth onClick={this.back}>
                Back
            </Button>
      </div>
    );
  }
}

NewEffect.propTypes = {
  classes: PropTypes.object.isRequired,
};



export default withStyles(styles)(NewEffect)