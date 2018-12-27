import React from 'react';
import Dropzone from 'react-dropzone';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import UserService from '../../apis/UserService';
import Edit from '../../components/Edit';


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


class InstructorEdit extends React.PureComponent {
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

  componentDidMount() {
    this.loadData();
  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    this.revokeObjectUrl(this.state.file);
  }

  loadData() {
    const { match: { params } } = this.props;

    this.setState({ loading: true });
    this.userService.getInstructor(params.id)
      .then(data => this.setState({
        email: data.email,
        fullName: data.full_name,
        displayName: data.display_name,
        bio: data.bio,
        image: data.image,
        loading: false,
      }))
      .catch(() => this.setState({ 
        loading: false 
      }))
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSave = () => {
    const { enqueueSnackbar, match: { params } } = this.props;
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
    this.userService.updateInstructor(params.id, formData)
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
    this.userService.deleteInstructor(params.id)
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
      file,
      email,
      fullName,
      displayName,
      bio,
      image,
      loading,
    } = this.state;

    return (
      <Edit 
        onSave={this.handleSave} 
        onBack={this.handleBack} 
        onDelete={this.handleDelete} 
        loading={loading}
        text='Edit Instructor'
        confirmDeleteDetail='All files uploaded by this user will be gone.'
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

          <FormControl margin='normal' required fullWidth>
            <InputLabel htmlFor='email'>Email Address</InputLabel>
            <Input 
              id='email' 
              name='email' 
              autoComplete='email' 
              value={email}
              autoFocus
              onChange={this.handleChange} 
              error={!!error.email}
            />
            {error.email && (
              <FormHelperText error>{error.email}</FormHelperText>
            )}
          </FormControl>

          <FormControl margin='normal' required fullWidth>
            <InputLabel htmlFor='fullName'>Full Name</InputLabel>
            <Input 
              id='fullName' 
              name='fullName'
              value={fullName}
              onChange={this.handleChange} 
              error={!!error.full_name}
            />
            {error.full_name && (
              <FormHelperText error>{error.full_name}</FormHelperText>
            )}
          </FormControl>

          <FormControl margin='normal' fullWidth>
            <InputLabel htmlFor='displayName'>Display Name</InputLabel>
            <Input 
              id='displayName' 
              name='displayName'
              value={displayName}
              onChange={this.handleChange} 
              error={!!error.display_name}
            />
            {error.display_name && (
              <FormHelperText error>{error.display_name}</FormHelperText>
            )}
          </FormControl>

          <FormControl margin='normal' fullWidth>
            <InputLabel htmlFor='bio'>Bio</InputLabel>
            <Input 
              id='bio' 
              name='bio'
              value={bio}
              onChange={this.handleChange}
              error={!!error.bio}
              multiline
            />
            {error.bio && (
              <FormHelperText error>{error.bio}</FormHelperText>
            )}
          </FormControl>
        </React.Fragment>
      </Edit>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(InstructorEdit);