import React from 'react';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import LanguageService from '../../apis/LanguageService';
import Edit from '../../components/Edit';


const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
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


class LanguageEdit extends React.PureComponent {
  languageService = new LanguageService();
  initialError = {
    code: '',
    name: '',
    native_name: '',
    non_field_errors: '',
    detail: '',
  }
  state = {
    code: '',
    name: '',
    nativeName: '',
    loading: false,
    error: {...this.initialError},
  };

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const { match: { params } } = this.props;

    this.setState({ loading: true });
    this.languageService.getLangauge(params.id)
      .then(data => this.setState({
        code: data.code,
        name: data.name,
        nativeName: data.native_name,
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
    const { code, name, nativeName } = this.state;
    const data = { code, name, native_name: nativeName };

    this.setState({error: {...this.initialError}, loading: true});
    this.languageService.updateLangauge(params.id, data)
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
    this.languageService.deleteLangauge(params.id)
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
      code,
      name,
      nativeName,
      loading,
    } = this.state;

    return (
      <Edit 
        onSave={this.handleSave} 
        onBack={this.handleBack} 
        onDelete={this.handleDelete} 
        loading={loading}
        text='Edit Language'
        confirmDeleteDetail="Courses' languages will be set to null."
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
            <InputLabel htmlFor='code'>Code</InputLabel>
            <Input 
              id='code' 
              name='code' 
              value={code}
              autoFocus
              onChange={this.handleChange} 
              error={!!error.code}
            />
            {error.code && (
              <FormHelperText error>{error.code}</FormHelperText>
            )}
          </FormControl>

          <FormControl margin='normal' required fullWidth>
            <InputLabel htmlFor='name'>Name</InputLabel>
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

          <FormControl margin='normal' required fullWidth>
            <InputLabel htmlFor='nativeName'>Native Name</InputLabel>
            <Input 
              id='nativeName' 
              name='nativeName' 
              value={nativeName}
              autoFocus
              onChange={this.handleChange} 
              error={!!error.native_name}
            />
            {error.native_name && (
              <FormHelperText error>{error.native_name}</FormHelperText>
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
)(LanguageEdit);