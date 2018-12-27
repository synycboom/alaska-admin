import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import LanguageList from './LanguageList';
import LanguageCreate from './LanguageCreate';
import LanguageEdit from './LanguageEdit';


class MainLanguage extends React.PureComponent {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route path={`${match.path}/list`} component={LanguageList} />
        <Route path={`${match.path}/create`} component={LanguageCreate} />
        <Route path={`${match.path}/:id`} component={LanguageEdit} />
        <Route path={match.path} exact component={LanguageList} />
      </Switch>
    );
  }
}

export default withRouter(MainLanguage);