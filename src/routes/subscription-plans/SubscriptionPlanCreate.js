import React from 'react';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import SubscriptionPlanService from '../../apis/SubscriptionPlanService';
import CurrencyService from '../../apis/CurrencyService';
import Create from '../../components/Create';
import NumberFormattedInput from '../../components/NumberFormattedInput';


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


class SubscriptionPlanCreate extends React.PureComponent {
  subscriptionPlanService = new SubscriptionPlanService();
  currencyService = new CurrencyService();
  initialError = {
    name: '',
    days: '',
    price: '',
    currency: '',
    non_field_errors: '',
    detail: '',
  }
  state = {
    currencies: [],
    name: '',
    days: '',
    price: '',
    currency: '',
    loading: false,
    error: {...this.initialError},
  };

  componentDidMount() {
    this.setState({loading: true});
    this.currencyService.listAllCurrencies()
      .then(data => {
        this.setState({currencies: data.results});
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
        this.setState({loading: false});
      })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSave = () => {
    const { enqueueSnackbar } = this.props;
    const { name, days, currency, price } = this.state;
    const data = { name, days, currency, price };

    this.setState({error: {...this.initialError}, loading: true});
    this.subscriptionPlanService.createSubscriptionPlan(data)
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
      loading,
      currencies,
      name,
      days,
      price,
      currency,
    } = this.state;

    return (
      <Create 
        onSave={this.handleSave} 
        onBack={this.handleBack} 
        loading={loading}
        text='Create Subscription Plan'
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

          <FormControl margin='normal' fullWidth>
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
            <InputLabel htmlFor='days'>Day (s)</InputLabel>
            <Input 
              id='days' 
              name='days' 
              value={days}
              autoFocus
              onChange={this.handleChange} 
              error={!!error.days}
              inputComponent={NumberFormattedInput}
            />
            {error.days && (
              <FormHelperText error>{error.days}</FormHelperText>
            )}
          </FormControl>

          <FormControl margin='normal' required fullWidth>
            <InputLabel htmlFor='price'>Price</InputLabel>
            <Input 
              id='price' 
              name='price' 
              value={price}
              autoFocus
              onChange={this.handleChange} 
              error={!!error.price}
              inputComponent={NumberFormattedInput}
            />
            {error.price && (
              <FormHelperText error>{error.price}</FormHelperText>
            )}
          </FormControl>

          <FormControl required fullWidth>
            <InputLabel htmlFor='currency'>Currency</InputLabel>
            <Select
              value={currency}
              onChange={this.handleChange}
              inputProps={{ name: 'currency', id: 'currency' }}
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>

              {currencies.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}

            </Select>

            {error.currency && (
              <FormHelperText error>{error.currency}</FormHelperText>
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
)(SubscriptionPlanCreate);