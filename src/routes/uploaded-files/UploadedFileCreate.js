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

import UploadedFileService from '../../apis/UploadedFileService';
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
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});


class UploadedFileCreate extends React.PureComponent {
  uploadedFileService = new UploadedFileService();
  tagService = new TagService();
  initialError = {
    name: '',
    file: '',
    tags: '',
    non_field_errors: '',
    detail: '',
  }
  state = {
    name: '',
    file: null,
    tags: [],
    allTags: [],
    loading: false,
    error: {...this.initialError},
  };

  onDrop = ([file]) => {
    if (file) {
      this.setState({ file });
    } else {
      this.setState({ file: null });
    }
  }

  onCancelFile = () => {
    this.setState({ file: null });
  };

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
    const { enqueueSnackbar } = this.props;
    const { name, file, tags } = this.state;
    const formData = new FormData();
    
    formData.append('name', name);
    formData.append('tags', tags.map(item => item.value));

    if (file) {
      formData.append('file', file);
    }

    this.setState({error: {...this.initialError}, loading: true});
    this.uploadedFileService.createUploadedFile(formData)
      .then(data => {
        enqueueSnackbar(data.detail, { variant: 'success' });
        this.handleBack();
      })
      .catch(this.catchError)
      .then(() => {
        this.setState({ 
          loading: false 
        });
      })
  }

  handleBack = () => {
    this.props.history.goBack();
  }
  
  render() {
    const { classes } = this.props;
    const {
      error,
      name,
      file,
      tags,
      allTags,
      loading,
    } = this.state;

    return (
      <Create 
        onSave={this.handleSave} 
        onBack={this.handleBack} 
        loading={loading}
        text='Upload File'
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
            name='tags'
            value={tags}
            options={allTags}
            onChange={this.handleChange}
            textFieldProps={{label: 'Tags'}}
            isMulti
            isCreatable
          />

          <div>
            <Dropzone
              maxFiles={1}
              onDrop={this.onDrop}
              onFileDialogCancel={this.onCancelFile}
            >
              {({getRootProps, getInputProps}) => (
                <div {...getRootProps()} className={classes.dropzone}>
                  <input {...getInputProps()} />
                  <p>Drop a file here, or click to select a file</p>
                </div>
              )}
            </Dropzone>

            {file && (
              <h4>{`${file.name} - ${formatBytes(file.size)}`}</h4>
            )}
            
          </div>

          {error.file && (
            <Typography variant='body1' className={classes.otherError}>
              {error.file}
            </Typography>
          )}
        </React.Fragment>
      </Create>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(UploadedFileCreate);