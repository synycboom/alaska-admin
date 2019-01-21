import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SimpleGrid from '../../components/SimpleGrid';
import UploadedFileService from '../../apis/UploadedFileService';

import { Table } from '@devexpress/dx-react-grid-material-ui';

class ModSelectVideo extends React.PureComponent {
  uploadedFileService = new UploadedFileService();
  columns = [
    { name: 'name', title: 'Name' },
    { name: 'owner_full_name', title: 'Owner' },
    { name: 'file', title: 'File' },
    { name: 'hash_tags', title: 'Tags' },
    { name: '__select__', title: ' ' },
  ];
  tableColumnExtensions = [
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
        aria-labelledby='mod-select-file-title'
      >
        <DialogTitle id='mod-select-file-title'>Select an Uploaded File</DialogTitle>
        <DialogContent>
          <SimpleGrid
            renderCell={this.renderCell}
            fetchDataList={this.uploadedFileService.listUploadedFiles}
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