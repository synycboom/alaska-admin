import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';


const styles = theme => ({
  input: {
    display: 'flex',
    padding: '20px 12px 10px',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
    zIndex: 1,
  },
  paper: {
    position: 'absolute',
    zIndex: 2,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color='textSecondary'
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component='div'
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color='textSecondary'
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper
      square 
      className={props.selectProps.classes.paper} 
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

class SelectInput extends React.Component {
  handleChange = (value) => {
    if (value instanceof Array) {
      value = value.map(item => item.value);
    } else {
      value = value.value;
    }
    
    const event = {
      target: {
        name: this.props.name,
        value: value,
      }
    };

    this.props.onChange(event);
  };

  getNewOptionData = (inputValue, optionLabel) => {
    if (!inputValue.includes(' ')) {
      return {
        label: optionLabel,
        value: inputValue,
        __isNew__: true,
      }
    }
  };

  render() {
    const { 
      classes,
      theme,
      options,
      value,
      isMulti,
      isCreatable,
      textFieldProps,
      placeholder,
    } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    // Automatically find a value from the options 
    let derivedValue;

    if (value instanceof Array) {
      derivedValue = value.map(val => options.find(
        option => option.value === val
      ));
    } else if (value) {
      derivedValue = options.find(
        option => option.value === value
      );
    } else {
      // value doesn't have a truth value maybe it's null or undefined
      // don't do anything here
    }

    if (isMulti && isCreatable) {
      return (
        <CreatableSelect
          classes={classes}
          styles={selectStyles}
          textFieldProps={textFieldProps}
          options={options}
          components={components}
          value={derivedValue}
          onChange={this.handleChange}
          placeholder={placeholder}
          getNewOptionData={this.getNewOptionData}
          isMulti
        />
      );
    } else if (isMulti) {
      return (
        <Select
          classes={classes}
          styles={selectStyles}
          textFieldProps={textFieldProps}
          options={options}
          components={components}
          value={derivedValue}
          onChange={this.handleChange}
          placeholder={placeholder}
          isClearable
          isMulti
        />
      );
    } else {
      return (
        <Select
          classes={classes}
          styles={selectStyles}
          textFieldProps={textFieldProps}
          options={options}
          components={components}
          value={derivedValue}
          onChange={this.handleChange}
          placeholder={placeholder}
          isClearable
        />
      );
    }
  }
}

SelectInput.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  value: PropTypes.any,
  isMulti: PropTypes.bool,
  isCreatable: PropTypes.bool,
  textFieldProps: PropTypes.object,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

SelectInput.defaultProps = {
  placeholder: '',
  options: [],
  onChange: () => {},
};

export default withStyles(styles, { withTheme: true })(SelectInput);