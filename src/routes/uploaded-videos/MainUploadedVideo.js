import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import UploadedVideoList from './UploadedVideoList';
import UploadedVideoCreate from './UploadedVideoCreate';
import UploadedVideoEdit from './UploadedVideoEdit';


class MainUploadedVideo extends React.PureComponent {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route path={`${match.path}/list`} component={UploadedVideoList} />
        <Route path={`${match.path}/create`} component={UploadedVideoCreate} />
        <Route path={`${match.path}/:id`} component={UploadedVideoEdit} />
        <Route path={match.path} exact component={UploadedVideoList} />
      </Switch>
    );
  }
}

export default withRouter(MainUploadedVideo);