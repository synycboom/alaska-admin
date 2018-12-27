import React from 'react';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import CurrencyService from '../../apis/CurrencyService';
import Create from '../../components/Create';


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


class InstructorCreate extends React.PureComponent {
  currencyService = new CurrencyService();
  initialError = {
    code: '',
    name: '',
    symbol: '',
    symbol_native: '',
    non_field_errors: '',
    detail: '',
  }
  state = {
    code: '',
    name: '',
    symbol: '',
    symbolNative: '',
    loading: false,
    error: {...this.initialError},
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSave = () => {
    const { enqueueSnackbar } = this.props;
    const { code, name, symbol, symbolNative } = this.state;
    const data = { code, name, symbol, symbol_native: symbolNative };

    this.setState({error: {...this.initialError}, loading: true});
    this.currencyService.createCurrency(data)
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
      code,
      name,
      symbol,
      symbolNative,
      loading,
    } = this.state;

    return (
      <Create 
        onSave={this.handleSave} 
        onBack={this.handleBack} 
        loading={loading}
        text='Create Currency'
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
            <InputLabel htmlFor='symbol'>Symbol</InputLabel>
            <Input 
              id='symbol' 
              name='symbol' 
              value={symbol}
              autoFocus
              onChange={this.handleChange} 
              error={!!error.symbol}
            />
            {error.symbol && (
              <FormHelperText error>{error.symbol}</FormHelperText>
            )}
          </FormControl>

          <FormControl margin='normal' required fullWidth>
            <InputLabel htmlFor='symbolNative'>Symbol Native</InputLabel>
            <Input 
              id='symbolNative' 
              name='symbolNative' 
              value={symbolNative}
              autoFocus
              onChange={this.handleChange} 
              error={!!error.symbol_native}
            />
            {error.symbol_native && (
              <FormHelperText error>{error.symbol_native}</FormHelperText>
            )}
          </FormControl>

        </React.Fragment>
      </Create>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(InstructorCreate);