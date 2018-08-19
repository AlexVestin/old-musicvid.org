import React from 'react';

import Button from 'material-ui/Button'
import { connect } from 'react-redux'
import { createSound, setAudioItemView, setSidebarWindowIndex, selectAudio, removeSound } from '@redux/actions/items'
import Delete from '@material-ui/icons/Delete'
import withHeader from './withheader'
import AudioItem from './audioitem'
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';

const styles = theme => ({})

class Audio extends React.Component {

    componentDidMount() {
        setAudioItemView(0)
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
        const { audioItems } = this.props;
        const item = audioItems[this.props.audioIdx]

        return (
            <div>
            <input accept="audio/*" type="file" ref={(ref) => this.fileInputRef = ref} style={{ display: 'none' }} />
            {this.props.audioItemView === 0 &&
                <div>
                    <List>
                        {audioItems.map((item, i) => (
                        <ListItem disableRipple key={item.name} dense button onClick={() => this.onClick(i)}>
                            <ListItemText primary={item.name} />
                            <ListItemSecondaryAction>
        
                                    <Delete style={{cursor: "pointer"}}color="secondary" onClick={() => removeSound(item.id)}></Delete>

                            </ListItemSecondaryAction>
                        </ListItem>
                        ))}
                    </List>
                    <Button fullWidth variant="raised" onClick={() => this.fileInputRef.click()}>load audio</Button>
                    <Button disabled fullWidth variant="raised" onClick={() => setAudioItemView(2)}>fft settings</Button>
                </div>
            } 
            {this.props.audioItemView === 1  && <AudioItem item={item} onBack={this.itemBack}></AudioItem>} 
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



export default connect(mapStateToProps)(withHeader((Audio)))