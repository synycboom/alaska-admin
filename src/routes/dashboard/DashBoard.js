import React from 'react';
import CardOrder from './CardOrder';
import CardSubscription from './CardSubscription';

class DashBoard extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <CardOrder />
        <CardSubscription />
      </React.Fragment>
    );
  }
}

export default DashBoard;
