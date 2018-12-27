import React from 'react';
import { Table } from '@devexpress/dx-react-grid-material-ui';

import CategoryService from '../../apis/CategoryService';
import RedirectCell from '../../components/RedirectCell';
import List from '../../components/List';


class CategoryList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.categoryService = new CategoryService();
    this.columns = [
      { name: 'name', title: 'Name' },
      { name: '__edit__', title: ' ' },
    ];
    this.tableColumnExtensions = [
      { columnName: '__edit__', width: 70 }
    ]
  }

  handleAdd = () => {
    this.props.history.push('/categories/create');
  }

  renderCell = (props) => {
    const { column, row } = props;

    if (column.name === '__edit__') {
      return <RedirectCell {...props} to={`/categories/${row.id}`}/>;
    }
    return <Table.Cell {...props} />;
  };

  render() {
    return (
      <List
        text='Category List'
        onAdd={this.handleAdd}
        renderCell={this.renderCell}
        fetchDataList={this.categoryService.listCategories}
        columns={this.columns}
        tableColumnExtensions={this.tableColumnExtensions}
      />
    );
  }
}

export default CategoryList;