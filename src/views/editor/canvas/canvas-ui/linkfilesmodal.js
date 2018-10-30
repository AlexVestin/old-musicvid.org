import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { dispatchAction } from '@redux/actions/items'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CheckCircleOutline from '@material-ui/icons/CheckCircle'
import Modal from '@material-ui/core/Modal';

const style= {
    top: `30%`,
    left: `25%`,
};

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 110,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },

  wrapper: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between"
  },
  iconWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "100%",
      justifyContent: "center",
      marginLeft: 10,
  }
});



class InputButton extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {loaded: false}

        this.audioRef = React.createRef();
        this.videoRef = React.createRef();
        this.imageRef = React.createRef();
    }

    componentDidMount = () => {
        let add = (type, input) => {
            this.setState({loaded: true})
            this.props.add(input.files[0], this.props.file)
        }

        this.audioRef.current.onchange = () => {
            add("IMAGE", this.audioRef.current)
        }

        this.imageRef.current.onchange = () => {
            add("VIDEO", this.imageRef.current)
        }
    }

    click = () => {
        switch(this.props.file.itemType) {
            case "SOUND":
                this.audioRef.current.click()
                break;
            case "IMAGE":
                this.imageRef.current.click()
                break;
            case "VIDEO":
                this.videoRef.current.click();
                break;
            default:
        }
        
    }
    

    render() {
        const { classes } = this.props
        const color = this.state.loaded ? "green" : "gray"
        return( 
            <React.Fragment>
                <input accept="image/*" type="file" ref={this.imageRef} style={{ display: 'none' }} />
                <input accept="video/mp4,video/mkv,video/x-m4v,video/*" type="file" ref={this.videoRef} style={{ display: 'none' }} />
                <input accept="audio/*" type="file" ref={this.audioRef} style={{ display: 'none' }} />
                    
                    <div className={classes.wrapper}>
                        <div className={classes.iconWrapper}>{this.props.file.itemType}</div>
        
                        <div className={classes.iconWrapper} style={{color}}>
                            <CheckCircleOutline></CheckCircleOutline>
                        </div>
                        <Button onClick={this.click}>Link</Button>
                    </div>
            </React.Fragment>
        )
    }
}

InputButton = withStyles(styles)(InputButton)

class SimpleModal extends React.Component {
   

    add = (file, config) => {
        dispatchAction({type: "ADD_LINKED_FILE", payload: {file, config}})
    }


    handleClose = () => {
        this.props.onCancel()
    }

    render() {
        const { classes } = this.props
        return (
            <React.Fragment>
               
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.props.open}
                    onClose={this.handleClose}
                >

                    <div style={style} className={classes.paper}>
                        <Typography variant="title" id="modal-title">
                            Link files
                        </Typography>
                        <Typography variant="subheading" id="simple-modal-description">
                            {this.props.files.map((file, i) => {
                                return <div className={classes.wrapper}> 
                                    <div>{file.name}</div>
                                    
                                    <InputButton file={file} add={this.add}></InputButton>
                                   
                                </div>
                            })}
                        </Typography>
                            
                    </div>       
                </Modal>

            </React.Fragment>
            
        );
    }
}


export default withStyles(styles)(SimpleModal)