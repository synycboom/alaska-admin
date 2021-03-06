import React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LanguageIcon from '@material-ui/icons/Language';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import CategoryIcon from '@material-ui/icons/Category';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ImageIcon from '@material-ui/icons/Image';
import VideocamIcon from '@material-ui/icons/Videocam';
import QueuePlayNextIcon from '@material-ui/icons/QueuePlayNext';

import ListItemLink from './ListItemLink';

import { drawerWidth } from '../configs/conf';
import AuthService from '../apis/AuthService';

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});


class ShakyDrawer extends React.PureComponent {
  authService = new AuthService();

  handleLogOut = () => {
    this.authService.signout();
    this.props.history.push('/login');
  }

  render() {
    const { 
      classes, 
      open,
      onDrawerClose,
    } = this.props;

    return (
      <Drawer
        className={classes.drawer}
        variant='persistent'
        anchor='left'
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={onDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>

        <Divider />

        <List component='nav'>
          <ListItemLink to='/dashboard' primary='Dashboard' icon={<DashboardIcon />} />
          <ListItemLink to='/instructors' primary='Instructors' icon={<AccessibilityIcon />} />
          <ListItemLink to='/subscription-plans' primary='Subscription Plans' icon={<FormatListBulletedIcon />} />
          <Divider />
          <ListItemLink to='/courses' primary='Courses' icon={<QueuePlayNextIcon />} />
          <ListItemLink to='/tags' primary='Tags' icon={<BookmarkIcon />} />
          <ListItemLink to='/uploaded-files' primary='Files' icon={<FileCopyIcon />} />
          <ListItemLink to='/uploaded-images' primary='Images' icon={<ImageIcon />} />
          <ListItemLink to='/uploaded-videos' primary='Videos' icon={<VideocamIcon />} />
          <Divider />
          <ListItemLink to='/currencies' primary='Currencies' icon={<AttachMoneyIcon />} />
          <ListItemLink to='/languages' primary='Languages' icon={<LanguageIcon />} />
          <ListItemLink to='/levels' primary='Levels' icon={<TrendingUpIcon />} />
          <ListItemLink to='/categories' primary='Categories' icon={<CategoryIcon />} />
          <ListItemLink to='/subcategories' primary='Subcategories' icon={<ViewModuleIcon />} />
          <Divider />
          <ListItem button onClick={this.handleLogOut}>
            <ListItemIcon>
                <PowerSettingsNewIcon />
            </ListItemIcon>
            <ListItemText inset primary='Log Out' />
          </ListItem>
        </List>

      </Drawer>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
)(withRouter(ShakyDrawer));