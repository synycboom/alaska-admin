import React from 'react';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';
import Dropzone from 'react-dropzone';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';

import UploadedVideoService from '../../apis/UploadedVideoService';
import TagService from '../../apis/TagService';

import Edit from '../../components/Edit';
import SelectInput from '../../components/SelectInput';
import ReactHLS from '../../components/ReactHLS';
import { formatBytes } from '../../utils/file';


const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  otherError: {
    color: theme.palette.error.main,
  },
  dropzone: {
    borderWidth: 2,
    borderColor: '#666',
    borderStyle: 'dashed',
    borderRadius: 5,
    cursor: 'pointer',
    padding: 10,
    marginTop: 20,
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
    cover: '',
    tags: '',
    non_field_errors: '',
    detail: '',
  }
  state = {
    name: '',
    cover: null,
    coverPreview: '',
    tags: [],
    allTags: [],
    encodedVideos: [],
    loading: false,
    error: {...this.initialError},
  };

  onCoverDrop = ([file]) => {
    if (file) {
      this.setState(state => {
        this.revokeObjectUrl(state.cover);
        
        return {
          cover: Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        };
      });
    } else {
      this.setState(state => {
        this.revokeObjectUrl(state.cover);
        return { cover: null };
      });
    }
  }

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
        coverPreview: data.cover_preview,
        encodedVideos: data.encoded_videos,
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
    const { name, cover, tags } = this.state;
    const formData = new FormData();

    formData.append('name', name);
    formData.append('tags', tags.map(item => item.value));
    
    if (cover) {
      formData.append('cover', cover);
    }

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
      cover,
      coverPreview,
      tags,
      allTags,
      encodedVideos,
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

          <FormControl margin='normal' required fullWidth>
            <InputLabel shrink htmlFor='name'>Name</InputLabel>
            <Input
              id='name'
              name='name'
              value={name}
              autoFocus
              onChange={this.handleChange}
              error={!!error.name}
            />
            {error.name && (
              <FormHelperText error>{error.name}</FormHelperText>
            )}
          </FormControl>

          <SelectInput
            isMulti
            isCreatable
            textFieldProps={{label: 'Tags'}}
            name='tags'
            value={tags}
            options={allTags}
            onChange={this.handleChange}
          />

          <div>
            <Dropzone
              accept='image/*'
              maxFiles={1}
              onDrop={this.onCoverDrop}
            >
              {({getRootProps, getInputProps}) => (
                <div {...getRootProps()} className={classes.dropzone}>
                  <input {...getInputProps()} />

                  {cover || coverPreview ? (
                    <img
                      alt='Video Cover'
                      className={classes.image}
                      src={cover ? cover.preview : coverPreview}
                    />
                  ) : (
                    <div>
                      <p>Drop an <b>image</b> file here, or click to select an <b>image</b> file</p>
                    </div>
                  )}
                  
                  {cover && (
                    <h4>{`${cover.name} - ${formatBytes(cover.size)}`}</h4>
                  )}

                </div>
              )}
            </Dropzone>

            {error.cover && (
              <Typography variant='body1' className={classes.otherError}>
                {error.cover}
              </Typography>
            )}
          </div>

          <br />

          <h3>Videos</h3>
          {encodedVideos.map((video, index) => (
            <div key={index}>
              <p>width: {video.width}px</p>
              <p>height: {video.height}px</p>
              <p>duration: {video.duration} seconds</p>

              {video.progress === 100 ? (
                <ReactHLS
                  url={video.url}
                />
              ) : (
                <LinearProgress
                  color='secondary'
                  variant='determinate'
                  value={video.progress}
                />
              )}

              <Divider style={{marginTop: 20}}/>
            </div>
          ))}
        </React.Fragment>
      </Edit>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(UploadedVideoEdit);
