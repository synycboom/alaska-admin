import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import SimpleGrid from './SimpleGrid';
import ListHeader from './ListHeader';

const styles = (theme) => ({
  paper: {
    position: 'relative',
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

class List extends React.PureComponent {
  render() {
    const { 
      classes,
      text,
      onAdd,
      renderCell,
      fetchDataList,
      columns,
      gridChildren,
      tableColumnExtensions,
    } = this.props;

    return (
      <Paper className={classes.paper}>
        <ListHeader
          onAdd={onAdd}
          onRefresh={this.loadData}
          text={text}
        />

        <SimpleGrid 
          renderCell={renderCell}
          fetchDataList={fetchDataList}
          columns={columns}
          tableColumnExtensions={tableColumnExtensions}
          gridChildren={gridChildren}
        />

      </Paper>
    );
  }
}


List.propTypes = {
  text: PropTypes.string,
  onAdd: PropTypes.func,
  renderCell: PropTypes.func,
  fetchDataList: PropTypes.func,
  columns: PropTypes.array,
  tableColumnExtensions: PropTypes.array,
  gridChildren: PropTypes.element,
}

export default compose(
  withStyles(styles, { withTheme: true }),
)(List);