import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import LoadingButton from './LoadingButton';
import CreateHeader from './CreateHeader';


const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});


class Create extends React.PureComponent {
  render() {
    const { 
      classes,
      onSave,
      onBack,
      text,
      children,
      loading,
      withoutHeader,
    } = this.props;

    return (
      <Paper className={classes.paper}>
        {!withoutHeader && (
          <CreateHeader 
            text={text}
            onBack={onBack}
          />
        )}

        <form className={classes.form}>
          {children}
        </form>

        <LoadingButton
          fullWidth
          variant='contained'
          color='primary'
          loading={loading}
          className={classes.submit}
          onClick={onSave}
        >
          SAVE
        </LoadingButton>
      </Paper>
    );
  }
}

Create.propTypes = {
  classes: PropTypes.object.isRequired,
  onSave: PropTypes.func,
  onBack: PropTypes.func,
  text: PropTypes.string,
  children: PropTypes.element,
  loading: PropTypes.bool,
  withoutHeader: PropTypes.bool,
}

export default withStyles(styles, { withTheme: true })(Create);