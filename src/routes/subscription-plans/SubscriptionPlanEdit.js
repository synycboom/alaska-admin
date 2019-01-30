import React from 'react';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SelectInput from '../../components/SelectInput';
import SubscriptionPlanService from '../../apis/SubscriptionPlanService';
import CurrencyService from '../../apis/CurrencyService';
import Edit from '../../components/Edit';
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


class SubscriptionPlanEdit extends React.PureComponent {
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
    this.loadData();
  }

  loadData() {
    const { match: { params } } = this.props;

    this.setState({ loading: true });

    const promise1 = this.currencyService.listAllCurrencies()
      .then(data => {
        this.setState({currencies: data.results.map(item => ({ value: item.id, label: item.name }))});
      })
      .catch(error => {
        let newError = {};
        
        for (let key in error) {
          if (error.hasOwnProperty(key)) {
            newError[key] = error[key];  
          }
        }
        this.setState({error: newError});
      });

    const promise2 = this.subscriptionPlanService.getSubscriptionPlan(params.id)
      .then(data => this.setState({
        name: data.name,
        days: data.days,
        price: data.price,
        currency: data.currency,
      }))
      .catch(error => {
        let newError = {};
        
        for (let key in error) {
          if (error.hasOwnProperty(key)) {
            newError[key] = error[key];  
          }
        }
        this.setState({error: newError});
      });

    Promise.all([promise1, promise2])
      .then(() => null)
      .catch(() => null)
      .then(() => this.setState({loading: false}));
  }

  handleBack = () => {
    this.props.history.goBack();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSave = () => {
    const { enqueueSnackbar, match: { params } } = this.props;
    const { name, days, currency, price } = this.state;
    const data = { name, days, currency, price };

    this.setState({error: {...this.initialError}, loading: true});
    this.subscriptionPlanService.updateSubscriptionPlan(params.id, data)
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
  
  handleDelete = () => {
    const { enqueueSnackbar, match: { params } } = this.props;

    this.setState({error: {...this.initialError}, loading: true});
    this.subscriptionPlanService.deleteSubscriptionPlan(params.id)
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
      loading,
      currencies,
      name,
      days,
      price,
      currency,
    } = this.state;

    return (
      <Edit 
        onSave={this.handleSave} 
        onBack={this.handleBack} 
        onDelete={this.handleDelete} 
        loading={loading}
        text='Edit Subscription Plan'
        confirmDeleteDetail='All subscriptions, orders will be deleted'
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
            label='Day (s)'
            name='days'
            margin='normal'
            variant='filled'
            InputProps={{
              inputComponent: NumberFormattedInput,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            value={days}
            onChange={this.handleChange}
            error={!!error.days}
            helperText={error.days}
          />
          
          <TextField
            fullWidth
            required
            label='Price'
            name='price'
            margin='normal'
            variant='filled'
            InputProps={{
              inputComponent: NumberFormattedInput,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            value={price}
            onChange={this.handleChange}
            error={!!error.price}
            helperText={error.price}
          />
          
          <SelectInput
            textFieldProps={{
              label: 'Currency',
              variant: 'filled',
              margin: 'normal',
              error: !!error.currency,
              helperText: error.currency,
              InputLabelProps: {
                shrink: true,
              },
            }}
            name='currency'
            value={currency}
            options={currencies}
            onChange={this.handleChange}
          />

        </React.Fragment>
      </Edit>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(SubscriptionPlanEdit);