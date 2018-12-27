import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';

import ShakyAppBar from './components/ShakyAppBar';
import ShakyDrawer from './components/ShakyDrawer';
import ShakyMain from './components/ShakyMain';

import AuthService from './apis/AuthService';

const styles = () => ({
  root: {
    display: 'flex',
  },
});


class App extends React.Component {
  authService = new AuthService();

  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleLoginSuccess = () => {

  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <SnackbarProvider 
        maxSnack={3} 
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        action={[
          <Button color='secondary' size='small'>
              Dismiss
          </Button>
        ]}
      >
        <BrowserRouter>
          <div className={classes.root}>
            <CssBaseline />

            <ShakyAppBar 
              open={open}
              onDrawerOpen={this.handleDrawerOpen}
            />

            <ShakyDrawer 
              open={open}
              onDrawerClose={this.handleDrawerClose}
            />

            <ShakyMain 
              open={open}
            />
          </div>
        </BrowserRouter>
      </SnackbarProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);