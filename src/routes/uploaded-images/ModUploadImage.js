import React from 'react';
import PropTypes from 'prop-types';
import UploadedImageCreate from './UploadedImageCreate';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

class ModUploadImage extends React.PureComponent {
  render() {
    const { open, onClose, onSaveSuccess } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby='mod-upload-image-title'
      >
        <DialogTitle id='mod-upload-image-title'>Upload an Image</DialogTitle>
        <DialogContent>
          <UploadedImageCreate
            withoutHeader
            onSaveSuccess={onSaveSuccess}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

ModUploadImage.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSaveSuccess: PropTypes.func,
};

ModUploadImage.defaultProps = {
  onClose() {},
  onSaveSuccess() {},
};

export default ModUploadImage;