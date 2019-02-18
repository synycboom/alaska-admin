import React from 'react';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import UploadedImageService from '../../apis/UploadedImageService';
import TagService from '../../apis/TagService';

import Edit from '../../components/Edit';
import SelectInput from '../../components/SelectInput';

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  otherError: {
    color: theme.palette.error.main
  },
  image: {
    margin: theme.spacing.unit,
    width: 240,
    height: 135
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

class UploadedImageEdit extends React.PureComponent {
  uploadedImageService = new UploadedImageService();
  tagService = new TagService();
  initialError = {
    name: '',
    file: '',
    tags: '',
    non_field_errors: '',
    detail: ''
  };
  state = {
    name: '',
    originalImagePath: '',
    blurredImagePath: '',
    tags: [],
    allTags: [],
    loading: false,
    error: { ...this.initialError }
  };

  onDrop = ([file]) => {
    if (file) {
      this.setState(state => {
        this.revokeObjectUrl(state.file);

        return {
          file: Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        };
      });
    } else {
      this.setState(state => {
        this.revokeObjectUrl(state.file);

        return {
          file: null
        };
      });
    }
  };

  revokeObjectUrl(file) {
    if (file) {
      URL.revokeObjectURL(file.preview);
    }
  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    this.revokeObjectUrl(this.state.file);
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

    this.setState({ error: newError });
  };

  loadData() {
    const {
      match: { params }
    } = this.props;

    this.setState({ loading: true });
    const promise1 = this.tagService
      .listAllTags()
      .then(data => this.setState({ allTags: data.results }))
      .catch(this.catchError);

    const promise2 = this.uploadedImageService
      .getUploadedImage(params.id)
      .then(data =>
        this.setState({
          name: data.name,
          originalImagePath: data.original_image,
          blurredImagePath: data.blurred_image,
          tags: data.tags.map(tag => tag.name)
        })
      )
      .catch(this.catchError);

    Promise.all([promise1, promise2])
      .then(() => null)
      .catch(() => null)
      .then(() => this.setState({ loading: false }));
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSave = () => {
    const {
      enqueueSnackbar,
      match: { params }
    } = this.props;
    const { name, tags } = this.state;
    const formData = new FormData();

    formData.append('name', name);
    formData.append('tags', tags);

    this.setState({ error: { ...this.initialError }, loading: true });
    this.uploadedImageService
      .updateUploadedImage(params.id, formData)
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

        this.setState({ error: newError });
      })
      .then(() => {
        this.setState({
          loading: false
        });
      });
  };

  handleBack = () => {
    this.props.history.goBack();
  };

  handleDelete = () => {
    const {
      enqueueSnackbar,
      match: { params }
    } = this.props;

    this.setState({ error: { ...this.initialError }, loading: true });
    this.uploadedImageService
      .deleteUploadedImage(params.id)
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

        this.setState({ error: newError });
      })
      .then(() => {
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { classes } = this.props;
    const {
      error,
      name,
      tags,
      allTags,
      originalImagePath,
      blurredImagePath,
      loading
    } = this.state;

    return (
      <Edit
        onSave={this.handleSave}
        onBack={this.handleBack}
        onDelete={this.handleDelete}
        loading={loading}
        text="Edit Uploaded Image"
        confirmDeleteDetail="Model's fields that has this file will be set to null"
      >
        <React.Fragment>
          {error.non_field_errors && (
            <Typography variant="body1" className={classes.otherError}>
              {error.non_field_errors}
            </Typography>
          )}

          {error.detail && (
            <Typography variant="body1" className={classes.otherError}>
              {error.detail}
            </Typography>
          )}

          <FormControl margin="normal" required fullWidth>
            <InputLabel shrink htmlFor="name">
              Name
            </InputLabel>
            <Input
              id="name"
              name="name"
              value={name}
              autoFocus
              onChange={this.handleChange}
              error={!!error.name}
            />
            {error.name && <FormHelperText error>{error.name}</FormHelperText>}
          </FormControl>

          <SelectInput
            isMulti
            isCreatable
            textFieldProps={{ label: 'Tags' }}
            name="tags"
            value={tags}
            options={allTags}
            onChange={this.handleChange}
          />

          <p>Original Image</p>
          <img
            alt="original"
            className={classes.image}
            src={originalImagePath}
          />

          <p>Blurred Image</p>
          <img alt="blurred" className={classes.image} src={blurredImagePath} />

          {error.image && (
            <Typography variant="body1" className={classes.otherError}>
              {error.image}
            </Typography>
          )}
        </React.Fragment>
      </Edit>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar
)(UploadedImageEdit);
