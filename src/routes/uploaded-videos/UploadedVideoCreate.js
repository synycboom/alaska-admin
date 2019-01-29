import React from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';
import Dropzone from 'react-dropzone';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';

import UploadedVideoService from '../../apis/UploadedVideoService';
import TagService from '../../apis/TagService';

import Create from '../../components/Create';
import SelectInput from '../../components/SelectInput';
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


class UploadedVideoCreate extends React.PureComponent {
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
    file: null,
    cover: null,
    tags: [],
    allTags: [],
    loading: false,
    error: {...this.initialError},
  };

  // onDrop = ([file]) => {
  //   if (file) {
  //     this.setState({ file });
  //   } else {
  //     this.setState({ file: null });
  //   }
  // }

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
    const { name, file, tags, cover } = this.state;
    const formData = new FormData();
    
    formData.append('name', name);
    formData.append('tags', tags.map(item => item.value));

    if (file) {
      formData.append('file', file);
    }

    if (cover) {
      formData.append('cover', cover);
    }

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
      file,
      cover,
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

                  {cover ? (
                    <img
                      alt='Video Cover'
                      className={classes.image}
                      src={cover.preview}
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
          
          <TextField
            fullWidth
            required
            label='S3 File Path'
            name='file'
            margin='normal'
            variant='filled'
            InputLabelProps={{
              shrink: true,
            }}
            value={file}
            onChange={this.handleChange}
            error={!!error.file}
            helperText={error.file}
          />
          
          {/* <div>
            <Dropzone
              accept='video/*'
              maxFiles={1}
              onDrop={this.onDrop}
              onFileDialogCancel={this.onCancelFile}
            >
              {({getRootProps, getInputProps}) => (
                <div {...getRootProps()} className={classes.dropzone}>
                  <input {...getInputProps()} />

                  {file ? (
                    <h4>{`${file.name} - ${formatBytes(file.size)}`}</h4>
                  ) : (
                    <div>
                      <p>Drop a <b>video</b> file here, or click to select a <b>video</b> file</p>
                    </div>
                  )}
                </div>
              )}
            </Dropzone>
            
            {error.file && (
              <Typography variant='body1' className={classes.otherError}>
                {error.file}
              </Typography>
            )}
          </div> */}
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