import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import TagList from './TagList';
import TagCreate from './TagCreate';
import TagEdit from './TagEdit';


class MainTag extends React.PureComponent {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route path={`${match.path}/list`} component={TagList} />
        <Route path={`${match.path}/create`} component={TagCreate} />
        <Route path={`${match.path}/:id`} component={TagEdit} />
        <Route path={match.path} exact component={TagList} />
      </Switch>
    );
  }
}

export default withRouter(MainTag);