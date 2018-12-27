import React from 'react';
import { Table } from '@devexpress/dx-react-grid-material-ui';

import LanguageService from '../../apis/LanguageService';
import RedirectCell from '../../components/RedirectCell';
import List from '../../components/List';


class LanguageList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.languageService = new LanguageService();
    this.columns = [
      { name: 'code', title: 'Code' },
      { name: 'name', title: 'Name' },
      { name: 'native_name', title: 'Native Name' },
      { name: '__edit__', title: ' ' },
    ];
    this.tableColumnExtensions = [
      { columnName: '__edit__', width: 70 }
    ]
  }

  handleAdd = () => {
    this.props.history.push('/languages/create');
  }

  renderCell = (props) => {
    const { column, row } = props;

    if (column.name === '__edit__') {
      return <RedirectCell {...props} to={`/languages/${row.id}`}/>;
    }
    return <Table.Cell {...props} />;
  };

  render() {
    return (
      <List
        text='Language List'
        onAdd={this.handleAdd}
        renderCell={this.renderCell}
        fetchDataList={this.languageService.listLanguages}
        columns={this.columns}
        tableColumnExtensions={this.tableColumnExtensions}
      />
    );
  }
}

export default LanguageList;