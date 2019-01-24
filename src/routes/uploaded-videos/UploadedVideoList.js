import React from 'react';
import { Table } from '@devexpress/dx-react-grid-material-ui';

import UploadedVideoService from '../../apis/UploadedVideoService';
import RedirectCell from '../../components/RedirectCell';
import List from '../../components/List';


class UploadedVideoList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.uploadedVideoService = new UploadedVideoService();
    this.columns = [
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
    this.props.history.push('/uploaded-videos/create');
  }

  renderCell = (props) => {
    const { column, row } = props;

    if (column.name === '__edit__') {
      return <RedirectCell {...props} to={`/uploaded-videos/${row.id}`}/>;
    }
    return <Table.Cell {...props} />;
  };

  render() {
    return (
      <List
        text='Uploaded Video List'
        onAdd={this.handleAdd}
        renderCell={this.renderCell}
        fetchDataList={this.uploadedVideoService.listUploadedVideos}
        columns={this.columns}
        tableColumnExtensions={this.tableColumnExtensions}
      />
    );
  }
}

export default UploadedVideoList;