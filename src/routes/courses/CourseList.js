import React from 'react';
import { Table } from '@devexpress/dx-react-grid-material-ui';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

import CourseService from '../../apis/CourseService';
import RedirectCell from '../../components/RedirectCell';
import BooleanCell from '../../components/BooleanCell';
import List from '../../components/List';


const PrelineFormatter = ({ value }) => (
  <div style={{ whiteSpace: 'pre-line' }}>
    {value}
  </div>
);

const PrelineTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={PrelineFormatter}
    {...props}
  />
);

class CourseList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.courseService = new CourseService();
    this.columns = [
      { name: 'title', title: 'Title' },
      { name: 'headline', title: 'Headline' },
      { name: 'description', title: 'Description' },
      { name: 'published', title: 'Published' },
      { name: 'instructor__full_name', title: 'Instructor' },
      { name: 'language__name', title: 'Language' },
      { name: 'level__name', title: 'Level' },
      { name: 'category__name', title: 'Category' },
      { name: 'subcategory__name', title: 'SubCategory' },
      { name: 'subscription_plans_list', title: 'Subscription Plans' },
      { name: '__edit__', title: ' ' },
    ];
    this.tableColumnExtensions = [
      { columnName: 'subscription_plans_list', width: 300 },
      { columnName: '__edit__', width: 70 }
    ]
    this.prelineColumns = ['subscription_plans_list'];
  }

  handleAdd = () => {
    this.props.history.push('/courses/create');
  }

  renderCell = (props) => {
    const { column, row } = props;

    if (column.name === 'published') {
      return <BooleanCell {...props} boolean={row[column.name]} to={`/courses/${row.id}`}/>;
    }
    if (column.name === '__edit__') {
      return <RedirectCell {...props} to={`/courses/${row.id}`}/>;
    }
    return <Table.Cell {...props} />;
  };

  render() {
    return (
      <List
        text='Course List'
        onAdd={this.handleAdd}
        renderCell={this.renderCell}
        fetchDataList={this.courseService.listCoursesLanding}
        columns={this.columns}
        tableColumnExtensions={this.tableColumnExtensions}
        gridChildren={
          <PrelineTypeProvider
            for={this.prelineColumns}
          />
        }
      />
    );
  }
}

export default CourseList;