import React from 'react';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CourseService from '../../apis/CourseService';
import Paper from '@material-ui/core/Paper';
import EditHeader from '../../components/EditHeader';
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
});


class CourseEdit extends React.PureComponent {
  courseService = new CourseService();
  initialError = {
    name: '',
    non_field_errors: '',
    detail: '',
  }
  state = {
    name: '',
    loading: false,
    selectedTab: 0,
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

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  };

  handleSave = _ => {
    const { enqueueSnackbar } = this.props;
    const { name } = this.state;
    const data = { name };

    this.setState({error: {...this.initialError}, loading: true});
    this.courseService.createCategory(data)
      .then(data => {
        enqueueSnackbar(data.detail, { variant: 'success' });
        this.handleBack();
      })
      .catch(this.catchError)
      .then(_ => this.setState({ loading: false }));
  };

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
      name,
      loading,
      selectedTab,
    } = this.state;

    return (
      <Paper className={classes.paper}>
        <EditHeader 
          text='Edit Course' 
          onBack={this.handleBack} 
          onDelete={this.handleDelete} 
        />
        
        <br />

        {/* <Paper square>
          <Tabs 
            value={selectedTab} 
            indicatorColor='primary' 
            textColor='primary' 
            onChange={this.handleTabChange}
            fullWidth
          >
            <Tab label='Landing' className={classes.landingTab}/>
            <Tab label='Curriculum' className={classes.curriculumTab}/>
          </Tabs>
        </Paper>

        {selectedTab === 0 && <CourseLanding mode='update'/>}
        {selectedTab === 1 && <CourseCurriculum />} */}
        <CourseCurriculum />

      </Paper>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(CourseEdit);