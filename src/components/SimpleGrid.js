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
      loading: false,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  changeCurrentPage = currentPage => {
    this.setState({ currentPage, }, this.loadData );
  };

  loadData = () => {
    const { pageSize, currentPage } = this.state;
    const { manual, onManuallyFetch, fetchDataList, enqueueSnackbar } = this.props;

    if (manual) {
      onManuallyFetch(currentPage, pageSize);
      return
    }
    
    this.setState({ loading: true });

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
      classes,
      renderCell,
      columns,
      gridChildren,
      tableColumnExtensions,
      manual,
    } = this.props;

    let rows = null;
    let totalCount = null;
    let loading = null;
    let pageSize = null;
    let currentPage = null;

    if (manual) {
      rows = this.props.rows;
      totalCount = this.props.totalCount;
      loading = this.props.loading;
      pageSize = this.props.pageSize;
      currentPage = this.props.currentPage;
    } else {
      rows = this.state.rows;
      totalCount = this.state.totalCount;
      loading = this.state.loading;
      pageSize = this.state.pageSize;
      currentPage = this.state.currentPage;
    }

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

  manual: PropTypes.bool,
  onManuallyFetch: PropTypes.func,
  rows: PropTypes.array,
  totalCount: PropTypes.number,
  loading: PropTypes.bool,
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
}

SimpleGrid.defaultProps = {
  rows: [],
  totalCount: 0,
  manual: false,
  loading: false,
  pageSize: 10,
  currentPage: 0,
  onManuallyFetch() {},
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(SimpleGrid);