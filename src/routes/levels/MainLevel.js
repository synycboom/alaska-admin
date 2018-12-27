import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import LevelList from './LevelList';
import LevelCreate from './LevelCreate';
import LevelEdit from './LevelEdit';


class MainLevel extends React.PureComponent {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route path={`${match.path}/list`} component={LevelList} />
        <Route path={`${match.path}/create`} component={LevelCreate} />
        <Route path={`${match.path}/:id`} component={LevelEdit} />
        <Route path={match.path} exact component={LevelList} />
      </Switch>
    );
  }
}

export default withRouter(MainLevel);