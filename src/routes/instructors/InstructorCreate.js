import React from 'react';
import Dropzone from 'react-dropzone';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import UserService from '../../apis/UserService';
import Create from '../../components/Create';


const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  avatarContainer: {
    width: 'fit-content',
    cursor: 'pointer',
  },
  avatar: {
    margin: theme.spacing.unit,
    width: 100,
    height: 100,
  },
  otherError: {
    color: theme.palette.error.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});


class InstructorCreate extends React.PureComponent {
  userService = new UserService();
  initialError = {
    email: '',
    full_name: '',
    display_name: '',
    bio: '',
    image: '',
    non_field_errors: '',
    detail: '',
  }
  state = {
    email: '',
    fullName: '',
    displayName: '',
    bio: '',
    image: '',
    file: null,
    loading: false,
    error: {...this.initialError},
  };

  onDrop = ([file]) => {
    if (file) {
      this.setState(prevState => {
        this.revokeObjectUrl(prevState.file);
        
        return {
          file: Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        }
      });
    } else {
      this.setState(prevState => {
        this.revokeObjectUrl(prevState.file);

        return {
          file: null
        };
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
    this.revokeObjectUrl(this.state.file);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSave = () => {
    const { enqueueSnackbar } = this.props;
    const { email, displayName, fullName, bio, file } = this.state;
    const formData = new FormData();
    
    formData.append('email', email);
    formData.append('display_name', displayName);
    formData.append('full_name', fullName);
    formData.append('bio', bio);

    if (file) {
      formData.append('image', file);
    }

    this.setState({error: {...this.initialError}, loading: true});
    this.userService.createInstructor(formData)
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

  handleBack = () => {
    this.props.history.goBack();
  }
  
  render() {
    const { classes } = this.props;
    const {
      error,
      file,
      email,
      fullName,
      displayName,
      bio,
      image,
      loading,
    } = this.state;

    return (
      <Create 
        onSave={this.handleSave} 
        onBack={this.handleBack} 
        loading={loading}
        text='Create Instructor'
      >
        <React.Fragment>
        
          <div className={classes.avatarContainer}>
            <Dropzone
              accept='image/*'
              maxFiles={1}
              onDrop={this.onDrop}
            >
              {({getRootProps, getInputProps}) => (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Avatar className={classes.avatar} src={file ? file.preview : image}> </Avatar>
                </div>
              )}
            </Dropzone>

            {error.image && (
              <Typography variant='body1' className={classes.otherError}>
                {error.image}
              </Typography>
            )}
          </div>

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
            label='Email Address'
            name='email'
            margin='normal'
            variant='filled'
            InputLabelProps={{
              shrink: true,
            }}
            value={email}
            onChange={this.handleChange}
            error={!!error.email}
            helperText={error.email}
          />

          <TextField
            fullWidth
            required
            label='Full Name'
            name='fullName'
            margin='normal'
            variant='filled'
            InputLabelProps={{
              shrink: true,
            }}
            value={fullName}
            onChange={this.handleChange}
            error={!!error.full_name}
            helperText={error.full_name}
          />

          <TextField
            fullWidth
            label='Display Name'
            name='displayName'
            margin='normal'
            variant='filled'
            InputLabelProps={{
              shrink: true,
            }}
            value={displayName}
            onChange={this.handleChange}
            error={!!error.display_name}
            helperText={error.display_name}
          />

          <TextField
            fullWidth
            label='Bio'
            name='bio'
            margin='normal'
            variant='filled'
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            value={bio}
            onChange={this.handleChange}
            error={!!error.bio}
            helperText={error.bio}
          />

        </React.Fragment>
      </Create>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(InstructorCreate);