import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Table } from '@devexpress/dx-react-grid-material-ui';


const ThumbnailCell = ({ value, style }) => (
  <Table.Cell style={style}>
    <Avatar src={value} />
  </Table.Cell>
);

export default ThumbnailCell;