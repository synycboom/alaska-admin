import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import CourseList from './CourseList';
import CourseCreate from './CourseCreate';
import CourseEdit from './CourseEdit';


class MainCourse extends React.PureComponent {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route path={`${match.path}/list`} component={CourseList} />
        <Route path={`${match.path}/create`} component={CourseCreate} />
        <Route path={`${match.path}/:id`} component={CourseEdit} />
        <Route path={match.path} exact component={CourseList} />
      </Switch>
    );
  }
}

export default withRouter(MainCourse);