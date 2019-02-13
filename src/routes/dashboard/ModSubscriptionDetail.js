import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import SubscriptionService from '../../apis/SubscriptionService';
import LoadingButton from '../../components/LoadingButton';
import DatePicker from '../../components/DatePicker';

const styles = theme => ({
  otherError: {
    color: theme.palette.error.main
  }
});

class ModSubscriptionDetail extends React.PureComponent {
  subscriptionService = new SubscriptionService();
  initialError = {
    name: '',
    non_field_errors: '',
    detail: '',
    start_date: '',
    end_date: ''
  };
  initialState = {
    loading: false,
    courseName: '',
    startDate: '',
    endDate: '',
    orderNo: '',
    subscriptionPlanName: '',
    userFullName: '',
    error: this.initialError
  };
  state = { ...this.initialState };

  handleUpdateSubscription = _ => {
    const data = {
      start_date: this.state.startDate,
      end_date: this.state.endDate
    };
    this.setState({ error: { ...this.initialError }, loading: true });
    this.subscriptionService
      .updateSubscription(this.props.subscriptionId, data)
      .then(data => {
        this.props.enqueueSnackbar(data.detail, { variant: 'success' });
        this.setState({ loading: false });
        this.fetchData();
      })
      .catch(error => {
        let newError = {};

        for (let key in error) {
          if (error.hasOwnProperty(key)) {
            newError[key] = error[key];
          }
        }

        this.setState({ error: newError, loading: false });
        this.props.enqueueSnackbar('The action was not success.', {
          variant: 'error'
        });
      });
  };

  handleChange = (event, checked) => {
    this.setState({
      [event.target.name]:
        typeof checked === 'undefined' ? event.target.value : checked
    });
  };

  fetchData = _ => {
    this.setState({ loading: true });
    this.subscriptionService
      .getSubscription(this.props.subscriptionId)
      .then(data => {
        this.setState({
          courseName: data.course_name,
          startDate: data.start_date,
          endDate: data.end_date,
          orderNo: data.order_no,
          subscriptionPlanName: data.subscription_plan_name,
          userFullName: data.user_full_name
        });
      })
      .catch(error => {
        this.props.enqueueSnackbar('There is a problem, please check log.', {
          variant: 'error'
        });
        console.error(error);
      })
      .then(_ => this.setState({ loading: false }));
  };

  componentDidUpdate(props) {
    if (props.subscriptionId !== this.props.subscriptionId && this.props.open) {
      this.fetchData();
    }
  }

  render() {
    const { open, onClose, classes } = this.props;
    const {
      courseName,
      startDate,
      endDate,
      orderNo,
      subscriptionPlanName,
      userFullName,
      loading,
      error
    } = this.state;

    return (
      <Dialog fullWidth open={open} onClose={onClose}>
        <DialogContent>
          <h2>Subscription Detail</h2>
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
          <TextField
            fullWidth
            disabled
            label="User"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              shrink: true
            }}
            value={userFullName}
          />
          <TextField
            fullWidth
            disabled
            label="Course Name"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              shrink: true
            }}
            value={courseName}
          />
          <TextField
            fullWidth
            disabled
            label="Order Number"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              shrink: true
            }}
            value={orderNo}
          />
          <TextField
            fullWidth
            disabled
            label="Subscription Plan"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              shrink: true
            }}
            value={subscriptionPlanName}
          />
          <DatePicker
            fullWidth
            margin="normal"
            variant="filled"
            name="startDate"
            label="Start Date"
            InputLabelProps={{
              shrink: true
            }}
            value={startDate}
            error={!!error.start_date}
            helperText={error.start_date}
            onChange={this.handleChange}
          />
          <DatePicker
            fullWidth
            margin="normal"
            variant="filled"
            name="endDate"
            label="End Date"
            InputLabelProps={{
              shrink: true
            }}
            value={endDate}
            error={!!error.end_date}
            helperText={error.end_date}
            onChange={this.handleChange}
          />
          <LoadingButton
            fullWidth
            variant="contained"
            color="primary"
            loading={loading}
            onClick={this.handleUpdateSubscription}
          >
            UPDATE SUBSCRIPTION
          </LoadingButton>
        </DialogContent>
      </Dialog>
    );
  }
}

ModSubscriptionDetail.propTypes = {
  open: PropTypes.bool,
  subscriptionId: PropTypes.number,
  onClose: PropTypes.func
};

ModSubscriptionDetail.defaultProps = {
  onClose() {}
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar
)(ModSubscriptionDetail);
