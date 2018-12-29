import React from 'react';
import { Table } from '@devexpress/dx-react-grid-material-ui';

import TagService from '../../apis/TagService';
import RedirectCell from '../../components/RedirectCell';
import List from '../../components/List';


class TagList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.tagService = new TagService();
    this.columns = [
      { name: 'name', title: 'Name' },
      { name: '__edit__', title: ' ' },
    ];
    this.tableColumnExtensions = [
      { columnName: '__edit__', width: 70 }
    ]
  }

  handleAdd = () => {
    this.props.history.push('/tags/create');
  }

  renderCell = (props) => {
    const { column, row } = props;

    if (column.name === '__edit__') {
      return <RedirectCell {...props} to={`/tags/${row.id}`}/>;
    }
    return <Table.Cell {...props} />;
  };

  render() {
    return (
      <List
        text='Tag List'
        onAdd={this.handleAdd}
        renderCell={this.renderCell}
        fetchDataList={this.tagService.listTags}
        columns={this.columns}
        tableColumnExtensions={this.tableColumnExtensions}
      />
    );
  }
}

export default TagList;