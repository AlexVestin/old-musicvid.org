import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class AlertDialog extends React.Component {
  render() {
    return (
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Remove item"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to remove this item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button type="raised" onClick={this.props.handleClose} color="primary">
              No, keep it
            </Button>
            <Button type="raised" onClick={this.props.yesResponse} color="secondary" autoFocus>
              Yes, remove item
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

export default AlertDialog;