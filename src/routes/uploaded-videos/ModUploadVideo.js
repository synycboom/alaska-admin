import React from 'react';
import PropTypes from 'prop-types';
import UploadedVideoCreate from './UploadedVideoCreate';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

class ModUploadVideo extends React.PureComponent {
  render() {
    const { open, onClose, onSaveSuccess } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby='mod-upload-video-title'
      >
        <DialogTitle id='mod-upload-video-title'>Upload a Video</DialogTitle>
        <DialogContent>
          <UploadedVideoCreate
            withoutHeader
            onSaveSuccess={onSaveSuccess}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

ModUploadVideo.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSaveSuccess: PropTypes.func,
};

ModUploadVideo.defaultProps = {
  onClose() {},
  onSaveSuccess() {},
};

export default ModUploadVideo;