import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { Table } from '@devexpress/dx-react-grid-material-ui';
import { Link } from 'react-router-dom';


class RedirectCell extends React.PureComponent {
  renderButton = itemProps => {
    return <Link to={this.props.to} {...itemProps} />;
  };

  render() {
    const { style } = this.props;

    return (
      <Table.Cell style={style}>
        <IconButton color='primary' component={this.renderButton}>
          <EditIcon />
        </IconButton>
      </Table.Cell>
    );
  }
}

export default RedirectCell;