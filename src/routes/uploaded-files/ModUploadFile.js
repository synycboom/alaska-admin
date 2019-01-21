import React from 'react';
import PropTypes from 'prop-types';
import UploadedFileCreate from './UploadedFileCreate';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

class ModUploadFile extends React.PureComponent {
  render() {
    const { open, onClose, onSaveSuccess } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby='mod-upload-file-title'
      >
        <DialogTitle id='mod-upload-file-title'>Upload a File</DialogTitle>
        <DialogContent>
          <UploadedFileCreate
            withoutHeader
            onSaveSuccess={onSaveSuccess}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

ModUploadFile.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSaveSuccess: PropTypes.func,
};

ModUploadFile.defaultProps = {
  onClose() {},
  onSaveSuccess() {},
};

export default ModUploadFile;