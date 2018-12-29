import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import SubscriptionPlanList from './SubscriptionPlanList';
import SubscriptionPlanCreate from './SubscriptionPlanCreate';
import SubscriptionPlanEdit from './SubscriptionPlanEdit';


class MainSubscriptionPlan extends React.PureComponent {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route path={`${match.path}/list`} component={SubscriptionPlanList} />
        <Route path={`${match.path}/create`} component={SubscriptionPlanCreate} />
        <Route path={`${match.path}/:id`} component={SubscriptionPlanEdit} />
        <Route path={match.path} exact component={SubscriptionPlanList} />
      </Switch>
    );
  }
}

export default withRouter(MainSubscriptionPlan);