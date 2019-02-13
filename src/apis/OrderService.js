import BaseService from './BaseService';

class OrderService extends BaseService {
  listOrders = (currentPage, pageSize, filters) => {
    return this.client
      .get('/admin-api/v1.0/orders/', {
        params: { page: currentPage, page_size: pageSize, ...filters }
      })
      .then(res => res.data)
      .catch(this.handleError);
  };

  getOrder = id => {
    return this.client
      .get(`/admin-api/v1.0/orders/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  createSubscription = id => {
    return this.client
      .post(`/admin-api/v1.0/orders/${id}/subscription/`)
      .then(res => res.data)
      .catch(this.handleError);
  };
}

export default OrderService;
