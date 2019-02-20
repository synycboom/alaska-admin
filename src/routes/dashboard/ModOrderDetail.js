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
    phone: '',
    address: '',
    provinceName: '',
    districtName: '',
    cityName: '',
    zipCode: '',
    payment: {
      expirationTime: '',
      image: '',
      omiseChargeId: '',
      omiseToken: '',
      paymentNo: '',
      type: '',
      date: '',
      time: '',
      amount: ''
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
          phone: data.phone,
          address: data.address,
          provinceName: data.province_name,
          districtName: data.district_name,
          cityName: data.city_name,
          zipCode: data.zip_code,
          payment: {
            expirationTime: data.payment.expiration_time,
            image: data.payment.image,
            omiseChargeId: data.payment.omise_charge_id,
            omiseToken: data.payment.omise_token,
            paymentNo: data.payment.payment_no,
            type: data.payment.type,
            date: data.payment.date,
            time: data.payment.time,
            amount: data.payment.amount
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
      phone,
      address,
      provinceName,
      districtName,
      cityName,
      zipCode,
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
            label="User"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              readOnly: true,
              shrink: true
            }}
            value={userFullName}
          />
          <TextField
            fullWidth
            label="Course Name"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              readOnly: true,
              shrink: true
            }}
            value={courseName}
          />
          <TextField
            fullWidth
            label="Date"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              readOnly: true,
              shrink: true
            }}
            value={createdAt}
          />
          <TextField
            fullWidth
            label="Order Number"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              readOnly: true,
              shrink: true
            }}
            value={orderNo}
          />
          <TextField
            fullWidth
            label="Subscription Plan"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              readOnly: true,
              shrink: true
            }}
            value={subscriptionPlanName}
          />
          <h2>Contact Information</h2>
          <TextField
            fullWidth
            label="Phone"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              readOnly: true,
              shrink: true
            }}
            value={phone}
          />
          <TextField
            fullWidth
            label="Address"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              readOnly: true,
              shrink: true
            }}
            value={address}
          />
          <TextField
            fullWidth
            label="Province"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              readOnly: true,
              shrink: true
            }}
            value={provinceName}
          />
          <TextField
            fullWidth
            label="District"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              readOnly: true,
              shrink: true
            }}
            value={districtName}
          />
          <TextField
            fullWidth
            label="City"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              readOnly: true,
              shrink: true
            }}
            value={cityName}
          />
          <TextField
            fullWidth
            label="Zip Code"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              readOnly: true,
              shrink: true
            }}
            value={zipCode}
          />
          <h2>Subscription</h2>
          {subscription ? (
            <React.Fragment>
              <TextField
                fullWidth
                label="Start Date"
                name="name"
                margin="normal"
                variant="filled"
                InputLabelProps={{
                  readOnly: true,
                  shrink: true
                }}
                value={subscription.startDate}
              />
              <TextField
                fullWidth
                label="End Date"
                name="name"
                margin="normal"
                variant="filled"
                InputLabelProps={{
                  readOnly: true,
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
            label="Payment Number"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              readOnly: true,
              shrink: true
            }}
            value={payment.paymentNo}
          />
          <TextField
            fullWidth
            label="Type"
            name="name"
            margin="normal"
            variant="filled"
            InputLabelProps={{
              readOnly: true,
              shrink: true
            }}
            value={payment.type}
          />
          {payment.type === 'omise' ? (
            <React.Fragment>
              <TextField
                fullWidth
                label="Omise Charge ID"
                name="name"
                margin="normal"
                variant="filled"
                InputLabelProps={{
                  readOnly: true,
                  shrink: true
                }}
                value={payment.omiseChargeId}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <TextField
                fullWidth
                label="Date"
                name="date"
                margin="normal"
                variant="filled"
                InputLabelProps={{
                  readOnly: true,
                  shrink: true
                }}
                value={payment.date}
              />
              <TextField
                fullWidth
                label="Time"
                name="time"
                margin="normal"
                variant="filled"
                InputLabelProps={{
                  readOnly: true,
                  shrink: true
                }}
                value={payment.time}
              />
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                margin="normal"
                variant="filled"
                InputLabelProps={{
                  readOnly: true,
                  shrink: true
                }}
                value={payment.amount}
              />
              <img
                width="500"
                src={payment.image}
                alt={'an atm slip is not uploaded'}
              />
            </React.Fragment>
          )}
          {!subscription && (
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
