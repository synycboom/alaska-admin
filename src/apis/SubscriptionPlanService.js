import BaseService from './BaseService';

class SubscriptionPlanService extends BaseService {
  listSubscriptionPlans = (currentPage, pageSize) => {
    return this.client.get('/admin-api/v1.0/subscription-plans/', { 
      params: { page: currentPage, page_size: pageSize }
    })
      .then(res => res.data)
      .catch(this.handleError);
  };

  listAllSubscriptionPlans = () => {
    return this.client.get('/admin-api/v1.0/subscription-plans/all/')
      .then(res => res.data)
      .catch(this.handleError);
  };

  getSubscriptionPlan = (id) => {
    return this.client.get(`/admin-api/v1.0/subscription-plans/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  updateSubscriptionPlan = (id, data) => {
    return this.client.put(`/admin-api/v1.0/subscription-plans/${id}/`, data)
      .then(res => res.data)
      .catch(this.handleError);
  };

  deleteSubscriptionPlan = (id) => {
    return this.client.delete(`/admin-api/v1.0/subscription-plans/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  createSubscriptionPlan = (data) => {
    return this.client.post('/admin-api/v1.0/subscription-plans/', data)
      .then(res => res.data)
      .catch(this.handleError);
  };
}

export default SubscriptionPlanService;