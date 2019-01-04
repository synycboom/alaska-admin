import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';

import UploadedVideoService from '../../apis/UploadedVideoService';
import SelectImageCard from '../../components/SelectImageCard';
import TablePaginationActions from '../../components/TablePaginationActions';

class ModSelectVideo extends React.PureComponent {
  uploadedVideoService = new UploadedVideoService();
  state = {
    uploadedVideos: [],
    rowsPerPage: 10,
    page: 0,
    count: 20,
  };

  handlePageChange = (_, page) => {
    this.setState({ page }, this.fetch);
  };
  
  handleRowsPerPageChange = (event) => {
    this.setState({ rowsPerPage: event.target.value }, this.fetch);
  };

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps) {
    if (this.props.open !== prevProps.open && this.props.open) {
      this.fetch();
    }
  }

  fetch = () => {
    const { page, rowsPerPage } = this.state;
    
    this.uploadedVideoService.listUploadedVideos(page + 1, rowsPerPage)
      .then(data => this.setState({
        uploadedVideos: data.results,
        count: data.count,
      }))
      .catch(_ => this.props.enqueueSnackbar(
        'Something has gone wrong, please refresh.', 
        { variant: 'error' }
      ));
  };

  render() {
    const {
      open,
      onClose,
      onSelect,
    } = this.props;

    const {
      uploadedVideos,
      count,
      page,
      rowsPerPage,
    } = this.state;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby='mod-select-video-title'
      >
        <DialogTitle id='mod-select-video-title'>Select an Uploaded Video</DialogTitle>
        <DialogContent>
          <Grid container spacing={8}>
            {uploadedVideos.map(item => (
              <Grid item xs={6} sm={3} md={3} lg={3} xl={3} key={item.id}>
                <SelectImageCard
                  src={item.cover_preview} 
                  name={`${item.name}\n${item.hash_tags}`}
                  onClick={() => onSelect(item.id)}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20]}
          component='div'
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          ActionsComponent={TablePaginationActions}
          onChangePage={this.handlePageChange}
          onChangeRowsPerPage={this.handleRowsPerPageChange}
        />
      </Dialog>
    );
  }  
}

ModSelectVideo.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
};

ModSelectVideo.defaultProps = {
  onClose() {},
  onSelect() {},
};

export default ModSelectVideo;