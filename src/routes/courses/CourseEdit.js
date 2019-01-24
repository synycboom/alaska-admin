import React from 'react';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Tab from '@material-ui/core/Tab';
import CourseService from '../../apis/CourseService';
import Paper from '@material-ui/core/Paper';
import EditHeader from '../../components/EditHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import CourseLanding from './CourseLanding';
import CourseCurriculum from './CourseCurriculum';


const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  landingTab: {
    // backgroundColor: '#e2e2e2'
  },
  curriculumTab: {
    // backgroundColor: '#e2e2e2'
  },
  otherError: {
    color: theme.palette.error.main,
  },
});


class CourseEdit extends React.PureComponent {
  courseService = new CourseService();
  initialError = {
    non_field_errors: '',
    detail: '',
  }
  state = {
    name: '',
    loading: false,
    selectedTab: 0,
    openConfirmDialog: false,
    error: {...this.initialError},
  };

  catchError = error => {
    let newError = {};

    for (let key in error) {
      if (error.hasOwnProperty(key)) {
        newError[key] = error[key];
      }
    }

    this.setState({error: newError});
  };

  showConfirmDialog = () => {
    this.setState({ openConfirmDialog: true });
  };

  handleClose = () => {
    this.setState({ openConfirmDialog: false });
  };
  
  handleCancel = () => {
    this.setState({ openConfirmDialog: false });
  };
  
  handleOk = () => {
    const { enqueueSnackbar, match: { params } } = this.props;

    this.setState({error: {...this.initialError}, loading: true, openConfirmDialog: false});
    this.courseService.deleteCourse(params.id)
      .then(data => {
        enqueueSnackbar(data.detail, { variant: 'success' });
        this.handleBack();
      })
      .catch(this.catchError)
      .then(_ => this.setState({ loading: false }));
  };

  handleDelete = () => {
    this.showConfirmDialog();
  }

  handleBack = _ => {
    this.props.history.goBack();
  };
  
  handleTabChange = (_, selectedTab) => {
    this.setState({ selectedTab });
  };

  render() {
    const { classes } = this.props;
    const {
      error,
      openConfirmDialog,
      selectedTab,
    } = this.state;

    return (
      <Paper className={classes.paper}>
        <EditHeader 
          text='Edit Course' 
          onBack={this.handleBack} 
          onDelete={this.handleDelete}
        />
        
        {error.non_field_errors && (
          <Typography variant='body1' className={classes.otherError}>
            {error.non_field_errors}
          </Typography>
        )}

        {error.detail && (
          <Typography variant='body1' className={classes.otherError}>
            {error.detail}
          </Typography>
        )}

        <ConfirmDialog 
          open={openConfirmDialog}
          title={'Are you sure to delete ?'}
          description={'All sections and lessons will be deleted.'}
          onClose={this.handleClose}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        />

        <br />

        <Paper square>
          <Tabs 
            value={selectedTab} 
            indicatorColor='primary' 
            textColor='primary' 
            onChange={this.handleTabChange}
            variant='fullWidth'
          >
            <Tab label='Landing' className={classes.landingTab}/>
            <Tab label='Curriculum' className={classes.curriculumTab}/>
          </Tabs>
        </Paper>

        {selectedTab === 0 && <CourseLanding mode='update' onSaveSuccess={this.handleBack}/>}
        {selectedTab === 1 && <CourseCurriculum onSaveSuccess={this.handleBack} />}

      </Paper>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(CourseEdit);