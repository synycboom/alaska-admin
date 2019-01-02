import React from 'react';
import { Table } from '@devexpress/dx-react-grid-material-ui';

import UploadedImageService from '../../apis/UploadedImageService';
import RedirectCell from '../../components/RedirectCell';
import ThumbnailCell from '../../components/ThumbnailCell';
import List from '../../components/List';


class UploadedImageList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.uploadedImageService = new UploadedImageService();
    this.columns = [
      { name: 'file', title: 'File' },
      { name: 'name', title: 'Name' },
      { name: 'owner_full_name', title: 'Owner' },
      { name: 'hash_tags', title: 'Tags' },
      { name: '__edit__', title: ' ' },
    ];
    this.tableColumnExtensions = [
      { columnName: '__edit__', width: 70 }
    ]
  }

  handleAdd = () => {
    this.props.history.push('/uploaded-images/create');
  }

  renderCell = (props) => {
    const { column, row } = props;

    if (column.name === 'file') {
      return <ThumbnailCell {...props} />;
    }
    if (column.name === '__edit__') {
      return <RedirectCell {...props} to={`/uploaded-images/${row.id}`}/>;
    }
    return <Table.Cell {...props} />;
  };

  render() {
    return (
      <List
        text='Uploaded Image List'
        onAdd={this.handleAdd}
        renderCell={this.renderCell}
        fetchDataList={this.uploadedImageService.listUploadedImages}
        columns={this.columns}
        tableColumnExtensions={this.tableColumnExtensions}
      />
    );
  }
}

export default UploadedImageList;