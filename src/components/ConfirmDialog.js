import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


class ConfirmDialog extends React.PureComponent {
  render() {
    const {
      open,
      title,
      description,
      onCancel,
      onClose,
      onOk,
    } = this.props;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='primary' autoFocus onClick={onOk}>
            OK
          </Button>
          <Button color='secondary' onClick={onCancel}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
};

export default ConfirmDialog;