import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import withStyles from '@material-ui/core/styles/withStyles';

import AuthService from '../apis/AuthService';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  nonFieldError: {
    color: theme.palette.error.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Login extends React.PureComponent {
  authService = new AuthService();
  initialError = {
    username: '',
    password: '',
    non_field_errors: '',
    detail: '',
  }
  state = { 
    redirectToReferrer: false,
    username: '',
    password: '',
    error: {...this.initialError},
  };

  handleLogin = () => {
    const { username, password } = this.state;

    this.setState({error: {...this.initialError}});
    this.authService.authenticate(username, password)
      .then(() => {
        this.setState({ redirectToReferrer: true });
      })
      .catch(error => {
        let newError = {};

        if (error.hasOwnProperty('username')) {
          newError['username'] = error.username;
        }
        if (error.hasOwnProperty('password')) {
          newError['password'] = error.password;
        }
        if (error.hasOwnProperty('non_field_errors')) {
          newError['non_field_errors'] = error.non_field_errors;
        }
        if (error.hasOwnProperty('detail')) {
          newError['detail'] = error.detail;
        }

        this.setState({error: newError});
      });
  };

  handleKeyUp = event => {
    if (event.keyCode === 13) {
      this.handleLogin();
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const { classes } = this.props;
    const { 
      redirectToReferrer, 
      username, 
      password,
      error,
    } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={{ pathname: '/dashboard' }} />;
    }

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <form className={classes.form}>
            {error.non_field_errors && (
              <Typography variant='body1' className={classes.nonFieldError}>
                {error.non_field_errors}
              </Typography>
            )}
            {error.detail && (
              <Typography variant='body1' className={classes.nonFieldError}>
                {error.detail}
              </Typography>
            )}
            <FormControl margin='normal' required fullWidth>
              <InputLabel htmlFor='username'>Email Address</InputLabel>
              <Input 
                id='username' 
                name='username' 
                autoComplete='username' 
                autoFocus
                value={username}
                onChange={this.handleChange} 
                onKeyUp={this.handleKeyUp}
                error={!!error.username}
              />
              {error.username && (
                <FormHelperText error>{error.username}</FormHelperText>
              )}
            </FormControl>
            <FormControl margin='normal' required fullWidth>
              <InputLabel htmlFor='password'>Password</InputLabel>
              <Input 
                id='password' 
                name='password' 
                type='password' 
                value={password}
                autoComplete='current-password' 
                onChange={this.handleChange}
                onKeyUp={this.handleKeyUp}
                error={!!error.password}
              />
              {error.password && (
                <FormHelperText error>{error.password}</FormHelperText>
              )}
            </FormControl>
            <Button
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
              onClick={this.handleLogin}
            >
              Sign in
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);