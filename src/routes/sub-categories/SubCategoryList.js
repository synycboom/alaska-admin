import React from 'react';
import { Table } from '@devexpress/dx-react-grid-material-ui';

import SubCategoryService from '../../apis/SubCategoryService';
import RedirectCell from '../../components/RedirectCell';
import List from '../../components/List';


class SubCategoryList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.subCategoryService = new SubCategoryService();
    this.columns = [
      { name: 'parent_name', title: 'Parent' },
      { name: 'name', title: 'Name' },
      { name: '__edit__', title: ' ' },
    ];
    this.tableColumnExtensions = [
      { columnName: '__edit__', width: 70 }
    ]
  }

  handleAdd = () => {
    this.props.history.push('/sub-categories/create');
  }

  renderCell = (props) => {
    const { column, row } = props;

    if (column.name === '__edit__') {
      return <RedirectCell {...props} to={`/sub-categories/${row.id}`}/>;
    }
    return <Table.Cell {...props} />;
  };

  render() {
    return (
      <List
        text='Sub-category List'
        onAdd={this.handleAdd}
        renderCell={this.renderCell}
        fetchDataList={this.subCategoryService.listSubCategories}
        columns={this.columns}
        tableColumnExtensions={this.tableColumnExtensions}
      />
    );
  }
}

export default SubCategoryList;