import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SimpleGrid from '../../components/SimpleGrid';
import UploadedVideoService from '../../apis/UploadedVideoService';

import { Table } from '@devexpress/dx-react-grid-material-ui';

class ModSelectVideo extends React.PureComponent {
  uploadedVideoService = new UploadedVideoService();
  columns = [
    { name: 'name', title: 'Name' },
    { name: 'owner_full_name', title: 'Owner' },
    { name: 'embedded_video', title: 'Video' },
    { name: 'duration', title: 'Duration' },
    { name: 'hash_tags', title: 'Tags' },
    { name: '__select__', title: ' ' },
  ];
  tableColumnExtensions = [
    { columnName: 'embedded_video', width: 300 },
    { columnName: '__select__', width: 70 }
  ]

  renderCell = (props) => {
    const { column, row } = props;

    if (column.name === '__select__') {
      return (
        <Table.Cell>
          <Button color='primary' onClick={_ => this.props.onSelect(row.id)}>
            SELECT
          </Button>
        </Table.Cell>
      );
    }
    if (column.name === 'embedded_video') {
      let embeddedVideo = row.embedded_video.replace(/width="(\d+)"/, 'width="200"');
      embeddedVideo = row.embedded_video.replace(/width="(\d+)"/, 'height="100"');
      return (
        <Table.Cell>
          <div dangerouslySetInnerHTML={{__html:embeddedVideo}} />
        </Table.Cell>
      );
    }
    return <Table.Cell {...props} />;
  };

  render() {
    const {
      open,
      onClose,
    } = this.props;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby='mod-select-video-title'
        maxWidth={'lg'}
      >
        <DialogTitle id='mod-select-video-title'>Select an Uploaded Video</DialogTitle>
        <DialogContent>
          <SimpleGrid
            renderCell={this.renderCell}
            fetchDataList={this.uploadedVideoService.listUploadedVideos}
            columns={this.columns}
            tableColumnExtensions={this.tableColumnExtensions}
          />
        </DialogContent>
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