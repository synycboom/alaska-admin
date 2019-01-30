import React from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import UploadedVideoService from '../../apis/UploadedVideoService';
import TagService from '../../apis/TagService';

import Create from '../../components/Create';
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


class UploadedVideoCreate extends React.PureComponent {
  uploadedVideoService = new UploadedVideoService();
  tagService = new TagService();
  initialError = {
    name: '',
    embedded_video: '',
    duration: '',
    tags: '',
    non_field_errors: '',
    detail: '',
  }
  state = {
    name: '',
    embeddedVideo: '',
    duration: 0,
    tags: [],
    allTags: [],
    loading: false,
    error: {...this.initialError},
  };

  onCancelFile = () => {
    this.setState({ file: null });
  };

  revokeObjectUrl(file) {
    if (file) {
      URL.revokeObjectURL(file.preview);
    }
  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    this.revokeObjectUrl(this.state.cover);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.setState({ loading: true });
    this.tagService.listAllTags()
      .then(data => {
        this.setState({ allTags: data.results });
      })
      .catch(this.catchError)
      .then(() => this.setState({loading: false}));
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
    });
  }

  handleSave = () => {
    const { enqueueSnackbar, onSaveSuccess } = this.props;
    const { name, embeddedVideo, tags, duration } = this.state;
    const formData = new FormData();
    
    formData.append('name', name);
    formData.append('embedded_video', embeddedVideo);
    formData.append('duration', duration);
    formData.append('tags', tags.map(item => item.value));

    this.setState({error: {...this.initialError}, loading: true});
    this.uploadedVideoService.createUploadedVideo(formData)
      .then(data => {
        enqueueSnackbar(data.detail, { variant: 'success' });
        onSaveSuccess(data.id)
        this.handleBack();
      })
      .catch(this.catchError)
      .then(() => this.setState({ loading: false }));
  }

  handleBack = () => {
    if (!this.props.withoutHeader) {
      this.props.history.goBack();
    }
  }
  
  render() {
    const { 
      classes,
      withoutHeader,
    } = this.props;

    const {
      error,
      name,
      embeddedVideo,
      duration,
      tags,
      allTags,
      loading,
    } = this.state;

    return (
      <Create 
        onSave={this.handleSave} 
        onBack={this.handleBack} 
        loading={loading}
        withoutHeader={withoutHeader}
        text='Upload Video'
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
      </Create>
    );
  }
}

UploadedVideoCreate.propTypes = {
  classes: PropTypes.object.isRequired,
  withoutHeader: PropTypes.bool,
  onSaveSuccess: PropTypes.func,
};

UploadedVideoCreate.defaultProps = {
  onSaveSuccess() {},
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(UploadedVideoCreate);