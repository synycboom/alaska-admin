import React from 'react';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CreateHeader from '../../components/CreateHeader';
import CourseLanding from './CourseLanding';


const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});


class CourseCreate extends React.PureComponent {
  handleBack = () => {
    this.props.history.goBack();
  };
  
  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.paper}>
        <CreateHeader 
          text='Create Course Landing'
          onBack={this.handleBack}
        />
        <CourseLanding 
          mode='create'
          onSaveSuccess={this.handleBack}
        />
      </Paper>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(CourseCreate);