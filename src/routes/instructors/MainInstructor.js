import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import InstructorList from './InstructorList';
import InstructorCreate from './InstructorCreate';
import InstructorEdit from './InstructorEdit';


class MainInstructor extends React.PureComponent {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route path={`${match.path}/list`} component={InstructorList} />
        <Route path={`${match.path}/create`} component={InstructorCreate} />
        <Route path={`${match.path}/:id`} component={InstructorEdit} />
        <Route path={match.path} exact component={InstructorList} />
      </Switch>
    );
  }
}

export default withRouter(MainInstructor);