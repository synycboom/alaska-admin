import BaseService from './BaseService';

class SubscriptionService extends BaseService {
  listSubscription = (currentPage, pageSize, filters) => {
    return this.client
      .get('/admin-api/v1.0/subscription/', {
        params: { page: currentPage, page_size: pageSize, ...filters }
      })
      .then(res => res.data)
      .catch(this.handleError);
  };

  getSubscription = id => {
    return this.client
      .get(`/admin-api/v1.0/subscription/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  updateSubscription = (id, data) => {
    return this.client
      .put(`/admin-api/v1.0/subscription/${id}/`, data)
      .then(res => res.data)
      .catch(this.handleError);
  };
}

export default SubscriptionService;
