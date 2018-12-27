import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


const styles = (theme) => ({
  container: {
    display: 'flex', 
    alignItems:'center'
  },
  typography: {
    flexGrow: 1
  },
  margin: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});


class EditHeader extends React.PureComponent {
  render() {
    const { 
      classes, 
      text, 
      onBack, 
      onDelete 
    } = this.props;

    return (
      <div className={classes.container}>
        <IconButton 
          variant='contained' 
          onClick={onBack}
        >
          <ChevronLeftIcon />
        </IconButton>

        <Typography component='h1' variant='h5' className={classes.typography}>
          {text}
        </Typography>

        <Button 
          variant='contained' 
          color='secondary' 
          className={classes.margin}
          onClick={onDelete}
        >
          DELETE
        </Button>
      </div>
    );
  }
}

EditHeader.propTypes = {
  text: PropTypes.string,
  onBack: PropTypes.func,
  onDelete: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(EditHeader);