import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CachedIcon from '@material-ui/icons/Cached';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


const styles = (theme) => ({
  container: {
    display: 'flex', 
    alignItems:'center',
    marginBottom: '15px',
  },
  typography: {
    flexGrow: 1
  },
  margin: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});


class ListHeader extends React.PureComponent {
  render() {
    const { 
      classes, 
      text, 
      onAdd,
      onRefresh,
    } = this.props;

    return (
      <div className={classes.container}>
        <Typography component='h1' variant='h5' className={classes.typography}>
          {text}
        </Typography>

        <IconButton 
          aria-label='REFRESH'
          className={classes.margin}
          onClick={onRefresh}
        >
          <CachedIcon />
        </IconButton>

        <Button 
          variant='contained' 
          color='primary'
          className={classes.margin}
          onClick={onAdd}
        >
          ADD
        </Button>
      </div>
    );
  }
}

ListHeader.propTypes = {
  text: PropTypes.string,
  onAdd: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(ListHeader);