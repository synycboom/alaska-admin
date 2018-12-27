import React from 'react';
import { Table } from '@devexpress/dx-react-grid-material-ui';

import LevelService from '../../apis/LevelService';
import RedirectCell from '../../components/RedirectCell';
import List from '../../components/List';


class LevelList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.levelService = new LevelService();
    this.columns = [
      { name: 'name', title: 'Name' },
      { name: '__edit__', title: ' ' },
    ];
    this.tableColumnExtensions = [
      { columnName: '__edit__', width: 70 }
    ]
  }

  handleAdd = () => {
    this.props.history.push('/levels/create');
  }

  renderCell = (props) => {
    const { column, row } = props;

    if (column.name === '__edit__') {
      return <RedirectCell {...props} to={`/levels/${row.id}`}/>;
    }
    return <Table.Cell {...props} />;
  };

  render() {
    return (
      <List
        text='Level List'
        onAdd={this.handleAdd}
        renderCell={this.renderCell}
        fetchDataList={this.levelService.listLevels}
        columns={this.columns}
        tableColumnExtensions={this.tableColumnExtensions}
      />
    );
  }
}

export default LevelList;