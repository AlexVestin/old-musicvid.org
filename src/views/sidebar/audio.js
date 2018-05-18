import React from 'react';

import Button from 'material-ui/Button'
import { connect } from 'react-redux'
import { createSound, setAudioItemView, setSidebarWindowIndex, selectAudio } from '../../redux/actions/items'

import AudioItem from './audioitem'
import List, { ListItem, ListItemText } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({

})

class Audio extends React.Component {
    state = { selected: 0, itemView: false }

    componentDidMount() {
        this.fileInputRef.onchange = () => {
            let file = this.fileInputRef.files[0]
            let name =  this.fileInputRef.files[0].name
            createSound({type:"SOUND", file, name})
        }
    }

    itemBack = () => {
        setAudioItemView(false)
    }

    onClick = (index) => {
        selectAudio({itemId: this.props.audioItems[index].id})
        //this.setState({selected: index, itemView: true})
    }

    back = () => {
        setSidebarWindowIndex(this.props.idxs.ITEMS)
    }

    render() {
        const { audioItems, classes } = this.props;
        const item = audioItems[this.props.audioIdx]
        console.log("=?=????")
        return (
            <div>
            <input accept="audio/*" type="file" ref={(ref) => this.fileInputRef = ref} style={{ display: 'none' }} />

            {this.props.audioItemView  ? 
                <AudioItem item={item} onBack={this.itemBack}></AudioItem>
                : 
                <div>
                    <List>
                        {audioItems.map((item, i) => (
                        <ListItem key={item.name} dense button className={classes.listItem} onClick={() => this.onClick(i)}>
                            <ListItemText primary={item.name} />
                        </ListItem>
                        ))}
                    </List>
                    <Button fullWidth variant="raised" onClick={() => this.fileInputRef.click()}>load audio</Button>
                </div>
                }
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        audioItems: state.items.audioItems,
        audioIdx: state.items.audioIdx,
        audioItemView: state.items.audioItemView
    }
}

export default connect(mapStateToProps)(withStyles(styles)(Audio))