import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import SubCategoryList from './SubCategoryList';
import SubCategoryCreate from './SubCategoryCreate';
import SubCategoryEdit from './SubCategoryEdit';


class MainSubCategory extends React.PureComponent {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route path={`${match.path}/list`} component={SubCategoryList} />
        <Route path={`${match.path}/create`} component={SubCategoryCreate} />
        <Route path={`${match.path}/:id`} component={SubCategoryEdit} />
        <Route path={match.path} exact component={SubCategoryList} />
      </Switch>
    );
  }
}

export default withRouter(MainSubCategory);