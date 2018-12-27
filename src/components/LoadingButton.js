import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});


class LoadingButton extends React.PureComponent {
  render() {
    const { classes, loading, children, onClick, className, ...rest } = this.props;
    
    const buttonClassname = classNames(className, {
      [classes.buttonSuccess]: !loading,
    });

    return (
      <div className={classes.wrapper}>
        <Button
          variant='contained'
          color='primary'
          className={buttonClassname}
          disabled={loading}
          onClick={onClick}
          {...rest}
        >
          {children}
        </Button>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(LoadingButton);