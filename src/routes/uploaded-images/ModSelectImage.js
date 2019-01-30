import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SimpleGrid from '../../components/SimpleGrid';
import UploadedImageService from '../../apis/UploadedImageService';

import { Table } from '@devexpress/dx-react-grid-material-ui';

class ModSelectImage extends React.PureComponent {
  uploadedImageService = new UploadedImageService();

  columns = [
    { name: 'name', title: 'Name' },
    { name: 'owner_full_name', title: 'Owner' },
    { name: 'original_image', title: 'Image' },
    { name: 'hash_tags', title: 'Tags' },
    { name: '__select__', title: ' ' },
  ];
  tableColumnExtensions = [
    { columnName: 'original_image', width: 300 },
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
    if (column.name === 'original_image') {
      return (
        <Table.Cell>
          <img width='200' src={row.original_image} alt={'uploaded'}/>
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
        aria-labelledby='mod-select-image-title'
        maxWidth={'lg'}
      >
        <DialogTitle id='mod-select-image-title'>Select an Uploaded Image</DialogTitle>
        <DialogContent>
          <SimpleGrid
            renderCell={this.renderCell}
            fetchDataList={this.uploadedImageService.listUploadedImages}
            columns={this.columns}
            tableColumnExtensions={this.tableColumnExtensions}
          />
        </DialogContent>
      </Dialog>
    );
  }  
}

ModSelectImage.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
};

ModSelectImage.defaultProps = {
  onClose() {},
  onSelect() {},
};

export default ModSelectImage;