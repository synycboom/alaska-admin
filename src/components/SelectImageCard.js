import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    // maxWidth: 150,
  },
  media: {
    // object-fit is not supported by IE 11.
    objectFit: 'cover',
  },
};

class SelectImageCard extends React.PureComponent {
  render() {
    const { classes, name, src, onClick } = this.props;
    return (
      <Card className={classes.card}>
        <CardActionArea onClick={onClick}>
          <CardMedia
            component='img'
            alt={name}
            className={classes.media}
            image={src || process.env.PUBLIC_URL + '/no_file_small.png'}
            title={name}
          />
          <CardContent>
            <Typography gutterBottom component='p'>
              {name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

SelectImageCard.propTypes = {
  classes: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  name: PropTypes.string,
};

export default withStyles(styles)(SelectImageCard);