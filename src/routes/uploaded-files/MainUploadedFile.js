import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import UploadedFileList from './UploadedFileList';
import UploadedFileCreate from './UploadedFileCreate';
import UploadedFileEdit from './UploadedFileEdit';


class MainUploadedFile extends React.PureComponent {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route path={`${match.path}/list`} component={UploadedFileList} />
        <Route path={`${match.path}/create`} component={UploadedFileCreate} />
        <Route path={`${match.path}/:id`} component={UploadedFileEdit} />
        <Route path={match.path} exact component={UploadedFileList} />
      </Switch>
    );
  }
}

export default withRouter(MainUploadedFile);