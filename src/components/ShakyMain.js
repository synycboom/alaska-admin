import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { drawerWidth } from '../configs/conf';
import { withRouter, Route } from 'react-router-dom';

import DashBoard from '../routes/DashBoard';
import MainInstructor from '../routes/instructors/MainInstructor';
import MainSubscriptionPlan from '../routes/subscription-plans/MainSubscriptionPlan';
import MainCurrency from '../routes/currencies/MainCurrency';
import MainLanguage from '../routes/languages/MainLanguage';
import MainLevel from '../routes/levels/MainLevel';
import MainCategory from '../routes/categories/MainCategory';
import MainSubCategory from '../routes/subcategories/MainSubCategory';
import MainTag from '../routes/tags/MainTag';
import MainUploadedFile from '../routes/uploaded-files/MainUploadedFile';
import MainUploadedImage from '../routes/uploaded-images/MainUploadedImage';
import MainUploadedVideo from '../routes/uploaded-videos/MainUploadedVideo';
import MainCourse from '../routes/courses/MainCourse';

import Login from '../components/Login';
import PrivateRoute from '../components/PrivateRoute';

const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
});


class ShakyMain extends React.PureComponent {
  render() {
    const {
      open,
      classes,
    } = this.props;

    return (
      <main
        className={classNames(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <PrivateRoute path='/' exact component={() => null} />
        <PrivateRoute path='/dashboard' component={DashBoard} />
        <PrivateRoute path='/instructors' component={MainInstructor} />
        <PrivateRoute path='/subscription-plans' component={MainSubscriptionPlan} />
        <PrivateRoute path='/currencies' component={MainCurrency} />
        <PrivateRoute path='/languages' component={MainLanguage} />
        <PrivateRoute path='/levels' component={MainLevel} />
        <PrivateRoute path='/categories' component={MainCategory} />
        <PrivateRoute path='/subcategories' component={MainSubCategory} />
        <PrivateRoute path='/tags' component={MainTag} />
        <PrivateRoute path='/uploaded-files' component={MainUploadedFile} />
        <PrivateRoute path='/uploaded-images' component={MainUploadedImage} />
        <PrivateRoute path='/uploaded-videos' component={MainUploadedVideo} />
        <PrivateRoute path='/courses' component={MainCourse} />
        <Route path='/login' component={Login} />
      </main>
    )
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(ShakyMain));
