import React from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  PagingState,
  CustomPaging,
} from '@devexpress/dx-react-grid';

import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';

const styles = (theme) => ({
  container: {
    position: 'relative',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class SimpleGrid extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      totalCount: 0,
      pageSize: 10,
      currentPage: 0,
      loading: true,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  changeCurrentPage = currentPage => {
    this.setState({
      loading: true,
      currentPage,
    }, 
      this.loadData
    );
  };

  loadData = () => {
    const { pageSize, currentPage } = this.state;
    const { fetchDataList, enqueueSnackbar } = this.props;

    fetchDataList(currentPage + 1, pageSize)
      .then(data => this.setState({
        rows: data.results,
        totalCount: data.count,
        loading: false,
      }))
      .catch((error) => {
        this.setState({ loading: false });
        enqueueSnackbar(error.detail, { variant: 'error' })
      });
  };

  renderCell = (props) => {
    return <Table.Cell {...props} />;
  };

  render() {
    const {
      rows, 
      pageSize, 
      currentPage, 
      totalCount,
      loading,
    } = this.state;

    const { 
      classes,
      renderCell,
      columns,
      gridChildren,
      tableColumnExtensions,
    } = this.props;

    return (
      <div className={classes.container}>
        <Grid
          rows={rows}
          columns={columns}
        >
          {gridChildren}
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
          />
          <CustomPaging
            totalCount={totalCount}
          />
          <Table 
            columnExtensions={tableColumnExtensions} 
            cellComponent={renderCell || this.renderCell}
          />
          <TableHeaderRow />
          <PagingPanel />
        </Grid>
        {loading && <CircularProgress className={classes.loading}/>}
      </div>
    );
  }
}


SimpleGrid.propTypes = {
  renderCell: PropTypes.func,
  fetchDataList: PropTypes.func,
  columns: PropTypes.array,
  tableColumnExtensions: PropTypes.array,
  gridChildren: PropTypes.element,
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(SimpleGrid);