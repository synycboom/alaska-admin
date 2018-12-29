import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';


class NumberFormattedInput extends React.PureComponent {
  handleValueChange = values => {
    const { onChange, name } = this.props;
    onChange({ target: { value: values.value, name } });
  };

  render() {
    const { inputRef, onChange, ...other } = this.props;
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={this.handleValueChange}
        thousandSeparator
      />
    );
  }
}

NumberFormattedInput.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default NumberFormattedInput;