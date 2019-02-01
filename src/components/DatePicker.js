import React from 'react';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';

class XDatePicker extends React.PureComponent {
  handleChange = (date) => {
    this.props.onChange({
      target: {
        name: this.props.name,
        value: date ? date.format() : null,
      }
    });
  };

  render() {
    const { onChange, value, ...rest } = this.props;
    const derivedValue = moment(value);

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          keyboard
          autoOk
          clearable
          value={derivedValue}
          onChange={this.handleChange}
          format={'MM/DD/YYYY'}
          mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
          {...rest}
        />
      </MuiPickersUtilsProvider>
    )
  }
}

export default XDatePicker;