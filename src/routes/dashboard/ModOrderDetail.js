import React from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import OrderService from '../../apis/OrderService';
import LoadingButton from '../../components/LoadingButton';

class ModOrderDetail extends React.PureComponent {
  orderService = new OrderService();
  initialState = {
    loading: false,
    courseName: '',
    createdAt: '',
    orderNo: '',
    subscriptionPlanName: '',
    userFullName: '',
    payment: {
      expirationTime: '',
      image: '',
      omiseChargeId: '',
      omiseToken: '',
      paymentNo: '',
      status: '',
      type: ''
    },
    subscription: null
  };
  state = { ...this.initialState };

  handleCreateSubscription = _ => {
    this.setState({ loading: true });
    this.orderService
      .createSubscription(this.props.orderId)
      .then(data => {
        this.props.enqueueSnackbar(data.detail, { variant: 'success' });
        this.setState({ loading: false });
        this.fetchData();
      })
      .catch(error => {
        this.props.enqueueSnackbar(error.detail, { variant: 'error' });
        this.setState({ loading: false });
      });
  };

  fetchData = _ => {
    this.setState({ loading: true });
    this.orderService
      .getOrder(this.props.orderId)
      .then(data => {
        this.setState({
          courseName: data.course_name,
          createdAt: data.created_at,
          orderNo: data.order_no,
          subscriptionPlanName: data.subscription_plan_name,
          userFullName: data.user_full_name,
          payment: {
            expirationTime: data.payment.expiration_time,
            image: data.payment.image,
            omiseChargeId: data.payment.omise_charge_id,
            omiseToken: data.payment.omise_token,
            paymentNo: data.payment.payment_no,
            status: data.payment.status,
            type: data.payment.type
          },
          subscription: data.subscription && {
            startDate: data.subscription.start_date,
            endDate: data.subscription.end_date
          }
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
    if (props.orderId !== this.props.orderId && this.props.open) {
      this.fetchData();
    }
  }

  render() {
    const { open, onClose } = this.props;
    const {
      courseName,
      createdAt,
      orderNo,
      subscriptionPlanName,
      userFullName,
      payment,
      subscription,
      loading
    } = this.state;

    return (
      <Dialog fullWidth open={open} onClose={onClose}>
        <DialogContent>
          <h2>Order Detail</h2>
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
            label="Date"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              shrink: true
            }}
            value={createdAt}
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
          <h2>Subscription</h2>
          {subscription ? (
            <React.Fragment>
              <TextField
                fullWidth
                disabled
                label="Start Date"
                name="name"
                margin="normal"
                variant="filled"
                InputLabelProps={{
                  shrink: true
                }}
                value={subscription.startDate}
              />
              <TextField
                fullWidth
                disabled
                label="End Date"
                name="name"
                margin="normal"
                variant="filled"
                InputLabelProps={{
                  shrink: true
                }}
                value={subscription.endDate}
              />
            </React.Fragment>
          ) : (
            <p>No Subscription</p>
          )}
          <h2>Payment</h2>
          <TextField
            fullWidth
            disabled
            label="Payment Number"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              shrink: true
            }}
            value={payment.paymentNo}
          />
          <TextField
            fullWidth
            disabled
            label="Type"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              shrink: true
            }}
            value={payment.type}
          />
          <TextField
            fullWidth
            disabled
            label="Status"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              shrink: true
            }}
            value={payment.status}
          />
          {payment.type === 'omise' ? (
            <React.Fragment>
              <TextField
                fullWidth
                disabled
                label="Omise Charge ID"
                name="name"
                margin="normal"
                variant="filled"
                InputLabelProps={{
                  shrink: true
                }}
                value={payment.omiseChargeId}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <TextField
                fullWidth
                disabled
                label="Expiration Time"
                name="name"
                margin="normal"
                variant="filled"
                InputLabelProps={{
                  shrink: true
                }}
                value={payment.expirationTime}
              />
              <img
                width="500"
                src={payment.image}
                alt={'an atm slip is not uploaded'}
              />
            </React.Fragment>
          )}
          {payment.status === 'successful' && !subscription && (
            <LoadingButton
              fullWidth
              variant="contained"
              color="primary"
              loading={loading}
              onClick={this.handleCreateSubscription}
            >
              CREATE SUBSCRIPTION
            </LoadingButton>
          )}
        </DialogContent>
      </Dialog>
    );
  }
}

ModOrderDetail.propTypes = {
  open: PropTypes.bool,
  orderId: PropTypes.number,
  onClose: PropTypes.func
};

ModOrderDetail.defaultProps = {
  onClose() {}
};

export default withSnackbar(ModOrderDetail);
