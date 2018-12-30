import React from 'react';
import { Table } from '@devexpress/dx-react-grid-material-ui';

import UploadedFileService from '../../apis/UploadedFileService';
import RedirectCell from '../../components/RedirectCell';
import List from '../../components/List';


class UploadedFileList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.uploadedFileService = new UploadedFileService();
    this.columns = [
      { name: 'name', title: 'Name' },
      { name: 'owner_full_name', title: 'Owner' },
      { name: 'file', title: 'File' },
      { name: 'hash_tags', title: 'Tags' },
      { name: '__edit__', title: ' ' },
    ];
    this.tableColumnExtensions = [
      { columnName: '__edit__', width: 70 }
    ]
  }

  handleAdd = () => {
    this.props.history.push('/uploaded-files/create');
  }

  renderCell = (props) => {
    const { column, row } = props;

    if (column.name === '__edit__') {
      return <RedirectCell {...props} to={`/uploaded-files/${row.id}`}/>;
    }
    return <Table.Cell {...props} />;
  };

  render() {
    return (
      <List
        text='Uploaded File List'
        onAdd={this.handleAdd}
        renderCell={this.renderCell}
        fetchDataList={this.uploadedFileService.listUploadedFiles}
        columns={this.columns}
        tableColumnExtensions={this.tableColumnExtensions}
      />
    );
  }
}

export default UploadedFileList;