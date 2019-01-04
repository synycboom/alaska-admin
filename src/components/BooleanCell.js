import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { Table } from '@devexpress/dx-react-grid-material-ui';


class BooleanCell extends React.PureComponent {
  render() {
    const { style, boolean } = this.props;

    return (
      <Table.Cell style={style}>
        {boolean ? (
          <CheckIcon color='primary'/>
        ) : (
          <CloseIcon color='primary'/>
        )}
      </Table.Cell>
    );
  }
}

export default BooleanCell;