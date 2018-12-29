import React from 'react';
import { Table } from '@devexpress/dx-react-grid-material-ui';

import SubscriptionPlanService from '../../apis/SubscriptionPlanService';
import RedirectCell from '../../components/RedirectCell';
import List from '../../components/List';


class SubscriptionPlanList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.subscriptionPlanService = new SubscriptionPlanService();
    this.columns = [
      { name: 'name', title: 'Name' },
      { name: 'days', title: 'Days' },
      { name: 'price', title: 'Price' },
      { name: 'currency_code', title: 'Currency Code' },
      { name: '__edit__', title: ' ' },
    ];
    this.tableColumnExtensions = [
      { columnName: '__edit__', width: 70 }
    ]
  }

  handleAdd = () => {
    this.props.history.push('/subscription-plans/create');
  }

  renderCell = (props) => {
    const { column, row } = props;

    if (column.name === '__edit__') {
      return <RedirectCell {...props} to={`/subscription-plans/${row.id}`}/>;
    }
    return <Table.Cell {...props} />;
  };

  render() {
    return (
      <List
        text='Subscription Plan List'
        onAdd={this.handleAdd}
        renderCell={this.renderCell}
        fetchDataList={this.subscriptionPlanService.listSubscriptionPlans}
        columns={this.columns}
        tableColumnExtensions={this.tableColumnExtensions}
      />
    );
  }
}

export default SubscriptionPlanList;