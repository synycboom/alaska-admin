import React from 'react';

import {
  Table,
} from '@devexpress/dx-react-grid-material-ui';

import UserService from '../../apis/UserService';
import ThumbnailCell from '../../components/ThumbnailCell';
import RedirectCell from '../../components/RedirectCell';
import List from '../../components/List';


class InstructorList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.userService = new UserService();
    this.columns = [
      { name: 'image', title: 'Image' },
      { name: 'full_name', title: 'Full Name' },
      { name: 'display_name', title: 'Display Name' },
      { name: 'email', title: 'Email' },
      { name: 'bio', title: 'Bio' },
      { name: '__edit__', title: ' ' },
    ];
    this.tableColumnExtensions = [
      { columnName: '__edit__', width: 70 }
    ]
  }

  handleAdd = () => {
    this.props.history.push('/instructors/create');
  }

  renderCell = (props) => {
    const { column, row } = props;
    
    if (column.name === 'image') {
      return <ThumbnailCell {...props} />;
    }
    if (column.name === '__edit__') {
      return <RedirectCell {...props} to={`/instructors/${row.id}`}/>;
    }
    return <Table.Cell {...props} />;
  };

  render() {
    return (
      <List
        text='Instructor List'
        onAdd={this.handleAdd}
        renderCell={this.renderCell}
        fetchDataList={this.userService.listInstructors}
        columns={this.columns}
        tableColumnExtensions={this.tableColumnExtensions}
      />
    );
  }
}

export default InstructorList;