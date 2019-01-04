import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { capitalize } from '@material-ui/core/utils/helpers';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';

export const styles = theme => ({
  /* Styles applied to the root element. */
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.palette.background.default,
    padding: 8,
  },
  /* Styles applied to the root element if `position="bottom"`. */
  positionBottom: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.mobileStepper,
  },
  /* Styles applied to the root element if `position="top"`. */
  positionTop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.mobileStepper,
  },
  /* Styles applied to the root element if `position="static"`. */
  positionStatic: {},
  /* Styles applied to the dots container if `variant="number"`. */
  numbers: {
    display: 'flex',
    flexDirection: 'row',
  },
  /* Styles applied to each dot if `variant="numbers"`. */
  number: {
    color: theme.palette.action.disabled,
    borderRadius: '50%',
    width: 8,
    height: 8,
    margin: '0 5px',
  },
  /* Styles applied to a dot if `variant="numbers"` and this is the active step. */
  numberActive: {
    color: theme.palette.primary.main,
  },
  /* Styles applied to the dots container if `variant="dots"`. */
  dots: {
    display: 'flex',
    flexDirection: 'row',
  },
  /* Styles applied to each dot if `variant="dots"`. */
  dot: {
    backgroundColor: theme.palette.action.disabled,
    borderRadius: '50%',
    width: 8,
    height: 8,
    margin: '0 2px',
  },
  /* Styles applied to a dot if `variant="dots"` and this is the active step. */
  dotActive: {
    backgroundColor: theme.palette.primary.main,
  },
  /* Styles applied to the Linear Progress component if `variant="progress"`. */
  progress: {
    width: '50%',
  },
});

function CustomStepper(props) {
  const {
    activeStep,
    backButton,
    classes,
    className: classNameProp,
    LinearProgressProps,
    nextButton,
    position,
    steps,
    variant,
    ...other
  } = props;

  const className = classNames(
    classes.root,
    classes[`position${capitalize(position)}`],
    classNameProp,
  );

  return (
    <Paper square elevation={0} className={className} {...other}>
      {backButton}
      {variant === 'numbers' && (
        <div className={classes.numbers}>
          {[...new Array(steps)].map((_, step) => {
            const numberClassName = classNames(classes.number, {
              [classes.numberActive]: step === activeStep,
            });
            // eslint-disable-next-line react/no-array-index-key
            return (
              <div key={step} className={numberClassName} onClick={() => console.log(step)}>
                {step + 1}
              </div>
            );
          })}
        </div>
      )}
      {variant === 'dots' && (
        <div className={classes.dots}>
          {[...new Array(steps)].map((_, step) => {
            const dotClassName = classNames(classes.dot, {
              [classes.dotActive]: step === activeStep,
            });
            // eslint-disable-next-line react/no-array-index-key
            return <div key={step} className={dotClassName} />;
          })}
        </div>
      )}
      {variant === 'progress' && (
        <LinearProgress
          className={classes.progress}
          variant="determinate"
          value={Math.ceil((activeStep / (steps - 1)) * 100)}
          {...LinearProgressProps}
        />
      )}
      {nextButton}
    </Paper>
  );
}

CustomStepper.propTypes = {
  /**
   * Set the active step (zero based index).
   * Defines which dot is highlighted when the variant is 'dots'.
   */
  activeStep: PropTypes.number,
  /**
   * A back button element. For instance, it can be be a `Button` or a `IconButton`.
   */
  backButton: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css-api) below for more details.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * Properties applied to the `LinearProgress` element.
   */
  LinearProgressProps: PropTypes.object,
  /**
   * A next button element. For instance, it can be be a `Button` or a `IconButton`.
   */
  nextButton: PropTypes.node,
  /**
   * Set the positioning type.
   */
  position: PropTypes.oneOf(['bottom', 'top', 'static']),
  /**
   * The total steps.
   */
  steps: PropTypes.number.isRequired,
  /**
   * The variant to use.
   */
  variant: PropTypes.oneOf(['text', 'dots', 'progress', 'numbers']),
};

CustomStepper.defaultProps = {
  activeStep: 0,
  position: 'bottom',
  variant: 'dots',
};

export default withStyles(styles, { name: 'MuiMobileStepper' })(CustomStepper);