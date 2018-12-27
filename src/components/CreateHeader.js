import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


const styles = () => ({
  container: {
    display: 'flex', 
    alignItems:'center'
  },
  typography: {
    flexGrow: 1
  },
});


class CreateHeader extends React.PureComponent {
  render() {
    const { 
      classes, 
      text, 
      onBack, 
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
      </div>
    );
  }
}

CreateHeader.propTypes = {
  text: PropTypes.string,
  onBack: PropTypes.func,
};

export default withStyles(styles)(CreateHeader);