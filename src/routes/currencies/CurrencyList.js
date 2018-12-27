import React from 'react';

import {
  Table,
} from '@devexpress/dx-react-grid-material-ui';

import CurrencyService from '../../apis/CurrencyService';
import RedirectCell from '../../components/RedirectCell';
import List from '../../components/List';


class CurrencyList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.currencyService = new CurrencyService();
    this.columns = [
      { name: 'code', title: 'Code' },
      { name: 'name', title: 'Name' },
      { name: 'symbol', title: 'Symbol' },
      { name: 'symbol_native', title: 'Symbol Native' },
      { name: '__edit__', title: ' ' },
    ];
    this.tableColumnExtensions = [
      { columnName: '__edit__', width: 70 }
    ]
  }

  handleAdd = () => {
    this.props.history.push('/currencies/create');
  }

  renderCell = (props) => {
    const { column, row } = props;

    if (column.name === '__edit__') {
      return <RedirectCell {...props} to={`/currencies/${row.id}`}/>;
    }
    return <Table.Cell {...props} />;
  };

  render() {
    return (
      <List
        text='Currency List'
        onAdd={this.handleAdd}
        renderCell={this.renderCell}
        fetchDataList={this.currencyService.listCurrencies}
        columns={this.columns}
        tableColumnExtensions={this.tableColumnExtensions}
      />
    );
  }
}

export default CurrencyList;