import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button'
import ConfigList from './input'
import { connect } from 'react-redux'
import { createSound, removeSound, setSidebarWindowIndex } from '../../redux/actions/items'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  textField: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    width: 80,
  },

  listItem: {
      height: 50,
      minHeight: 50
  }
});

class Audio extends React.Component {

    componentDidMount() {
        this.fileInputRef.onchange = () => {
            let file = this.fileInputRef.files[0]
            let name =  this.fileInputRef.files[0].name
            createSound({type:"SOUND", file, name})
        }
    }

    back = () => {
        setSidebarWindowIndex(this.props.idxs.ITEMS)
    }

    render() {

        const { classes, audioItems } = this.props;

        const item = audioItems[0]
        return (
            <div className={classes.root}>
            <input accept="audio/*" type="file" ref={(ref) => this.fileInputRef = ref} style={{ display: 'none' }} />
             
            {audioItems.length !== 0 ? 
                
                <ConfigList 
                    handleChange={() => {}} 
                    defaultConfig={item.defaultConfig} 
                    item={item} 
                    onDelete={removeSound} 
                    addAutomation={() => {}}
                    onBack={this.back}>
                </ConfigList>
                : 
                <Button fullWidth variant="raised" onClick={() => this.fileInputRef.click()}>load audio</Button>
            }

        </div>
        );
    }
}

Audio.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        audioItems: state.items.audioItems,

    }
}

export default connect(mapStateToProps)(withStyles(styles)(Audio)) 