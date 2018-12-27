import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import CategoryList from './CategoryList';
import CategoryCreate from './CategoryCreate';
import CategoryEdit from './CategoryEdit';


class MainCategory extends React.PureComponent {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route path={`${match.path}/list`} component={CategoryList} />
        <Route path={`${match.path}/create`} component={CategoryCreate} />
        <Route path={`${match.path}/:id`} component={CategoryEdit} />
        <Route path={match.path} exact component={CategoryList} />
      </Switch>
    );
  }
}

export default withRouter(MainCategory);