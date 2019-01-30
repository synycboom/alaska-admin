import React from 'react';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import UploadedVideoService from '../../apis/UploadedVideoService';
import TagService from '../../apis/TagService';

import Edit from '../../components/Edit';
import SelectInput from '../../components/SelectInput';


const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  otherError: {
    color: theme.palette.error.main,
  },
  iframeContainer: {
    background: 'black',
    '& iframe': {
      width: '100%',
    },
  },
  image: {
    marginTop: '10px',
    width: '100%',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});


class UploadedVideoEdit extends React.PureComponent {
  uploadedVideoService = new UploadedVideoService();
  tagService = new TagService();
  initialError = {
    name: '',
    file: '',
    duration: '',
    embedded_video: '',
    tags: '',
    non_field_errors: '',
    detail: '',
  }
  state = {
    name: '',
    duration: 0,
    embeddedVideo: '',
    tags: [],
    allTags: [],
    encodedVideos: [],
    loading: false,
    error: {...this.initialError},
  };

  componentDidMount() {
    this.loadData();
  }

  catchError = error => {
    let newError = {};

    for (let key in error) {
      if (error.hasOwnProperty(key)) {
        newError[key] = error[key];
      }
    }

    this.setState({error: newError});
  };

  loadData() {
    const { match: { params } } = this.props;

    this.setState({ loading: true });
    const promise1 = this.tagService.listAllTags()
      .then(data => this.setState({ allTags: data.results }))
      .catch(this.catchError);

    const promise2 = this.uploadedVideoService.getUploadedVideo(params.id)
      .then(data => this.setState({
        name: data.name,
        embeddedVideo: data.embedded_video,
        duration: data.duration,
        tags: data.tags,
      }))
      .catch(this.catchError);

    Promise.all([promise1, promise2])
      .then(() => null)
      .catch(() => null)
      .then(() => this.setState({loading: false}));
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSave = () => {
    const { enqueueSnackbar, match: { params } } = this.props;
    const { name, duration, tags, embeddedVideo } = this.state;
    const formData = new FormData();

    formData.append('name', name);
    formData.append('duration', duration);
    formData.append('embedded_video', embeddedVideo);
    formData.append('tags', tags.map(item => item.value));
    
    this.setState({error: {...this.initialError}, loading: true});
    this.uploadedVideoService.updateUploadedVideo(params.id, formData)
      .then(data => {
        enqueueSnackbar(data.detail, { variant: 'success' });
      })
      .catch(error => {
        let newError = {};

        for (let key in error) {
          if (error.hasOwnProperty(key)) {
            newError[key] = error[key];
          }
        }

        this.setState({error: newError});
      })
      .then(() => {
        this.setState({
          loading: false
        });
      })
  }

  handleBack = () => {
    this.props.history.goBack();
  }

  handleDelete = () => {
    const { enqueueSnackbar, match: { params } } = this.props;

    this.setState({error: {...this.initialError}, loading: true});
    this.uploadedVideoService.deleteUploadedVideo(params.id)
      .then(data => {
        enqueueSnackbar(data.detail, { variant: 'success' });
        this.handleBack();
      })
      .catch(error => {
        let newError = {};

        for (let key in error) {
          if (error.hasOwnProperty(key)) {
            newError[key] = error[key];
          }
        }

        this.setState({error: newError});
      })
      .then(() => {
        this.setState({
          loading: false
        });
      })
  }

  render() {
    const { classes } = this.props;
    const {
      error,
      name,
      duration,
      embeddedVideo,
      tags,
      allTags,
      loading,
    } = this.state;

    return (
      <Edit
        onSave={this.handleSave}
        onBack={this.handleBack}
        onDelete={this.handleDelete}
        loading={loading}
        text='Edit Uploaded Video'
        confirmDeleteDetail="Model's fields that has this file will be set to null"
      >
        <React.Fragment>
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

          <TextField
            fullWidth
            required
            label='Name'
            name='name'
            margin='normal'
            variant='filled'
            InputLabelProps={{
              shrink: true,
            }}
            value={name}
            onChange={this.handleChange}
            error={!!error.name}
            helperText={error.name}
          />

          <SelectInput
            isMulti
            isCreatable
            textFieldProps={{
              label: 'Tags',
              variant: 'filled',
              margin: 'normal',
              error: !!error.tags,
              helperText: error.tags,
              InputLabelProps: {
                shrink: true,
              },
            }}
            name='tags'
            value={tags}
            options={allTags}
            onChange={this.handleChange}
          />

          <TextField
            fullWidth
            required
            label='Vimeo Embedded Code'
            name='embeddedVideo'
            margin='normal'
            variant='filled'
            InputLabelProps={{
              shrink: true,
            }}
            value={embeddedVideo}
            onChange={this.handleChange}
            error={!!error.embedded_video}
            helperText={error.embedded_video}
          />
          
          <TextField
            fullWidth
            required
            label='Duration'
            name='duration'
            margin='normal'
            variant='filled'
            InputLabelProps={{
              shrink: true,
            }}
            value={duration}
            onChange={this.handleChange}
            error={!!error.duration}
            helperText={error.duration}
          />

          <div 
            className={classes.iframeContainer} 
            dangerouslySetInnerHTML={{__html: embeddedVideo}} 
          />
        </React.Fragment>
      </Edit>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(UploadedVideoEdit);
