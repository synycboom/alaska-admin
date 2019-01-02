import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import UploadedImageList from './UploadedImageList';
import UploadedImageCreate from './UploadedImageCreate';
import UploadedImageEdit from './UploadedImageEdit';


class MainUploadedImage extends React.PureComponent {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route path={`${match.path}/list`} component={UploadedImageList} />
        <Route path={`${match.path}/create`} component={UploadedImageCreate} />
        <Route path={`${match.path}/:id`} component={UploadedImageEdit} />
        <Route path={match.path} exact component={UploadedImageList} />
      </Switch>
    );
  }
}

export default withRouter(MainUploadedImage);