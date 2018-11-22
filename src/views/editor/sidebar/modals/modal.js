import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

const style= {
    top: `30%`,
    left: `50%`,
};

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class SimpleModal extends React.Component {
  
    handleClose = () => {
        this.props.onCancel()
    }

    render() {
        const { classes } = this.props;
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.props.open}
                onClose={this.handleClose}
            >
                <div style={style} className={classes.paper}>
                    <Typography variant="h1" id="modal-title">
                        Keeping audio
                    </Typography>
                    <Typography variant="subtitle1" id="simple-modal-description">
                        Currently importing audio along with the video is very slow. Longer videos
                        (5mins and up), can take several minutes or even crash the application
                    </Typography>
                    <Button onClick={() => this.props.onChoice(false)}>Discard audio </Button>
                    <Button onClick={() => this.props.onChoice(true)} >Keep audio</Button>

                </div>
            </Modal>
        );
    }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const ModalS = withStyles(styles)(SimpleModal);

export default ModalS;
