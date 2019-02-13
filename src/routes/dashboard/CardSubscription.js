import React from 'react';
import compose from 'recompose/compose';

import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Table } from '@devexpress/dx-react-grid-material-ui';
import SubscriptionService from '../../apis/SubscriptionService';
import DatePicker from '../../components/DatePicker';
import SimpleGrid from '../../components/SimpleGrid';
import ModSubscriptionDetail from './ModSubscriptionDetail';

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly'
  }
});

class CardSubscription extends React.PureComponent {
  subscriptionService = new SubscriptionService();
  columns = [
    { name: 'order_no', title: 'ORDER NO.' },
    { name: 'user_full_name', title: 'FULL NAME' },
    { name: 'course_name', title: 'COURSE NAME' },
    { name: 'subscription_plan_name', title: 'SUBSCRIPTION' },
    { name: 'start_date', title: 'START DATE' },
    { name: 'end_date', title: 'END DATE' },
    { name: '__select__', title: ' ' }
  ];
  tableColumnExtensions = [{ columnName: '__select__', width: 70 }];
  state = {
    orderNo: '',
    userFullName: '',
    startDate: null,
    endDate: null,
    courseName: '',
    subscriptionPlanName: '',
    rows: [],
    totalCount: 0,
    loading: false,
    pageSize: 10,
    currentPage: 0,
    selectedId: null,
    openModDetail: false
  };
  filters = {};

  handleChange = (event, checked) => {
    this.setState({
      [event.target.name]:
        typeof checked === 'undefined' ? event.target.value : checked
    });
  };

  handleViewClick = id => {
    this.setState({ openModDetail: true, selectedOrderId: id });
  };

  handleModDetailClose = _ => {
    this.setState({ openModDetail: false, selectedOrderId: null });
  };

  handleSearchClick = _ => {
    this.filters = {
      order_no: this.state.orderNo,
      user_full_name: this.state.userFullName,
      start_date: this.state.startDate,
      end_date: this.state.endDate,
      course_name: this.state.courseName,
      subscription_plan_name: this.state.subscriptionPlanName
    };

    this.handleFetchData(0, this.state.pageSize);
  };

  handleFetchData = (currentPage, pageSize) => {
    this.setState({ loading: true, pageSize, currentPage });

    this.subscriptionService
      .listSubscription(currentPage + 1, pageSize, this.filters)
      .then(data =>
        this.setState({
          rows: data.results,
          totalCount: data.count
        })
      )
      .catch(error => {
        if (error.__meta__.status === 404) {
          this.setState({ currentPage: 0 });
        } else {
          this.props.enqueueSnackbar(error.detail, { variant: 'error' });
        }
      })
      .then(_ => {
        this.setState({ loading: false });
      });
  };

  renderCell = props => {
    const { column, row } = props;

    if (column.name === '__select__') {
      return (
        <Table.Cell>
          <Button color="primary" onClick={_ => this.handleViewClick(row.id)}>
            VIEW
          </Button>
        </Table.Cell>
      );
    }
    return <Table.Cell {...props} />;
  };

  render() {
    const { classes } = this.props;
    const {
      orderNo,
      userFullName,
      startDate,
      endDate,
      courseName,
      subscriptionPlanName,
      rows,
      totalCount,
      loading,
      pageSize,
      currentPage,
      selectedOrderId,
      openModDetail
    } = this.state;

    return (
      <Paper className={classes.paper}>
        <h2>Subscription</h2>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <TextField
              fullWidth
              label="Order No."
              name="orderNo"
              margin="normal"
              variant="filled"
              InputLabelProps={{
                shrink: true
              }}
              value={orderNo}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <TextField
              fullWidth
              label="Full Name"
              name="userFullName"
              margin="normal"
              variant="filled"
              InputLabelProps={{
                shrink: true
              }}
              value={userFullName}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
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
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
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
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <TextField
              fullWidth
              label="Course Name"
              name="courseName"
              margin="normal"
              variant="filled"
              InputLabelProps={{
                shrink: true
              }}
              value={courseName}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <TextField
              fullWidth
              label="Subscription Plan Name"
              name="subscriptionPlanName"
              margin="normal"
              variant="filled"
              InputLabelProps={{
                shrink: true
              }}
              value={subscriptionPlanName}
              onChange={this.handleChange}
            />
          </Grid>
        </Grid>

        <Grid justify="space-between" container spacing={24}>
          <Grid item xs={12} sm={6} md={4} lg={2} />
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Button
              style={{ width: '100%' }}
              color="primary"
              variant="contained"
              onClick={this.handleSearchClick}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        <SimpleGrid
          manual
          pageSize={pageSize}
          currentPage={currentPage}
          loading={loading}
          rows={rows}
          totalCount={totalCount}
          renderCell={this.renderCell}
          onManuallyFetch={this.handleFetchData}
          columns={this.columns}
          tableColumnExtensions={this.tableColumnExtensions}
        />

        <ModSubscriptionDetail
          open={openModDetail}
          subscriptionId={selectedOrderId}
          onClose={this.handleModDetailClose}
        />
      </Paper>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar
)(CardSubscription);
