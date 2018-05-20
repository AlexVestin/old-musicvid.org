import React from 'react';

import Button from 'material-ui/Button'
import { connect } from 'react-redux'
import { createSound, setAudioItemView, setSidebarWindowIndex, selectAudio } from '../../redux/actions/items'

import AudioItem from './audioitem'
import List, { ListItem, ListItemText } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import FFTSettings from './fftsettings'

const styles = theme => ({})

class Audio extends React.Component {

    componentDidMount() {
        this.fileInputRef.onchange = () => {
            let file = this.fileInputRef.files[0]
            if(file) {
                let name =  this.fileInputRef.files[0].name
                createSound({type:"SOUND", file, name})
            }
        }
    }

    itemBack = () => {
        setAudioItemView(0)
    }

    onClick = (index) => {
        selectAudio({itemId: this.props.audioItems[index].id})
    }

    back = () => {
        setSidebarWindowIndex(this.props.idxs.ITEMS)
    }

    render() {
        const { audioItems, classes } = this.props;
        const item = audioItems[this.props.audioIdx]

        return (
            <div>
            <input accept="audio/*" type="file" ref={(ref) => this.fileInputRef = ref} style={{ display: 'none' }} />
            {this.props.audioItemView === 0 &&
                <div>
                    <List>
                        {audioItems.map((item, i) => (
                        <ListItem key={item.name} dense button className={classes.listItem} onClick={() => this.onClick(i)}>
                            <ListItemText primary={item.name} />
                        </ListItem>
                        ))}
                    </List>
                    <Button fullWidth variant="raised" onClick={() => this.fileInputRef.click()}>load audio</Button>
                    <Button disabled fullWidth variant="raised" onClick={() => setAudioItemView(2)}>fft settings</Button>
                </div>
            } 
            {this.props.audioItemView === 1  && <AudioItem item={item} onBack={this.itemBack}></AudioItem>} 
            {this.props.audioItemView === 2  && <FFTSettings onBack={this.itemBack}>hello</FFTSettings>}

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