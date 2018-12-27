import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import LoadingButton from './LoadingButton';
import EditHeader from './EditHeader';
import ConfirmDialog from './ConfirmDialog';


const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});


class Edit extends React.PureComponent {
  state = {
    openConfirmDialog: false
  };

  showConfirmDialog = () => {
    this.setState({ openConfirmDialog: true });
  };

  handleClose = () => {
    this.setState({ openConfirmDialog: false });
  };
  
  handleCancel = () => {
    this.setState({ openConfirmDialog: false });
  };
  
  handleOk = () => {
    this.setState({ openConfirmDialog: false });
    this.props.onDelete();
  };

  handleDelete = () => {
    this.showConfirmDialog();
  }

  render() {
    const { 
      classes,
      onSave,
      onBack,
      text,
      children,
      loading,
      confirmDeleteTitle,
      confirmDeleteDetail,
    } = this.props;

    const {
      openConfirmDialog
    } = this.state;

    return (
      <Paper className={classes.paper}>
        <EditHeader 
          text={text} 
          onBack={onBack} 
          onDelete={this.handleDelete} 
        />

        <form className={classes.form}>
          {children}
        </form>

        <LoadingButton
          fullWidth
          variant='contained'
          color='primary'
          loading={loading}
          className={classes.submit}
          onClick={onSave}
        >
          SAVE
        </LoadingButton>

        <ConfirmDialog 
          open={openConfirmDialog}
          title={confirmDeleteTitle}
          description={confirmDeleteDetail}
          onClose={this.handleClose}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        />
      </Paper>
    );
  }
}

Edit.propTypes = {
  classes: PropTypes.object.isRequired,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
  onBack: PropTypes.func,
  text: PropTypes.string,
  confirmDeleteTitle: PropTypes.string,
  confirmDeleteDetail: PropTypes.string,
  children: PropTypes.element,
  loading: PropTypes.bool,
}

Edit.defaultProps = {
  confirmDeleteTitle: 'Are you sure to delete ?',
  confirmDeleteDetail: '',
}

export default withStyles(styles, { withTheme: true })(Edit);