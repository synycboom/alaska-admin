import React from 'react';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CurrencyService from '../../apis/CurrencyService';
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


class CurrencyEdit extends React.PureComponent {
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

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const { match: { params } } = this.props;

    this.setState({ loading: true });
    this.currencyService.getCurrency(params.id)
      .then(data => this.setState({
        code: data.code,
        name: data.name,
        symbol: data.symbol,
        symbolNative: data.symbol_native,
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
    const { code, name, symbol, symbolNative } = this.state;
    const data = { code, name, symbol, symbol_native: symbolNative };

    this.setState({error: {...this.initialError}, loading: true});
    this.currencyService.updateCurrency(params.id, data)
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
    this.currencyService.deleteCurrency(params.id)
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
      symbol,
      symbolNative,
      loading,
    } = this.state;

    return (
      <Edit 
        onSave={this.handleSave} 
        onBack={this.handleBack} 
        onDelete={this.handleDelete} 
        loading={loading}
        text='Edit Currency'
        confirmDeleteDetail='All subscription, subscription plans, and orders will be gone.'
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
            label='Code'
            name='code'
            margin='normal'
            variant='filled'
            InputLabelProps={{
              shrink: true,
            }}
            value={code}
            onChange={this.handleChange}
            error={!!error.code}
            helperText={error.code}
          />

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

          <TextField
            fullWidth
            required
            label='Symbol'
            name='symbol'
            margin='normal'
            variant='filled'
            InputLabelProps={{
              shrink: true,
            }}
            value={symbol}
            onChange={this.handleChange}
            error={!!error.symbol}
            helperText={error.symbol}
          />

          <TextField
            fullWidth
            required
            label='Symbol Native'
            name='symbolNative'
            margin='normal'
            variant='filled'
            InputLabelProps={{
              shrink: true,
            }}
            value={symbolNative}
            onChange={this.handleChange}
            error={!!error.symbol_native}
            helperText={error.symbol_native}
          />

        </React.Fragment>
      </Edit>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(CurrencyEdit);