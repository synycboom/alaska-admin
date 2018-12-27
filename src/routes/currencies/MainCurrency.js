import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import CurrencyList from './CurrencyList';
import CurrencyCreate from './CurrencyCreate';
import CurrencyEdit from './CurrencyEdit';


class MainCurrency extends React.PureComponent {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route path={`${match.path}/list`} component={CurrencyList} />
        <Route path={`${match.path}/create`} component={CurrencyCreate} />
        <Route path={`${match.path}/:id`} component={CurrencyEdit} />
        <Route path={match.path} exact component={CurrencyList} />
      </Switch>
    );
  }
}

export default withRouter(MainCurrency);