import BaseService from './BaseService';

class CurrencyService extends BaseService {
  listCurrencies = (currentPage, pageSize) => {
    return this.client.get('/admin-api/v1.0/currencies/', { 
      params: { page: currentPage, page_size: pageSize }
    })
      .then(res => res.data)
      .catch(this.handleError);
  };

  listAllCurrencies = () => {
    return this.client.get('/admin-api/v1.0/currencies/all/')
      .then(res => res.data)
      .catch(this.handleError);
  };
  
  getCurrency = (id) => {
    return this.client.get(`/admin-api/v1.0/currencies/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  updateCurrency = (id, data) => {
    return this.client.put(`/admin-api/v1.0/currencies/${id}/`, data)
      .then(res => res.data)
      .catch(this.handleError);
  };

  deleteCurrency = (id) => {
    return this.client.delete(`/admin-api/v1.0/currencies/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  createCurrency = (data) => {
    return this.client.post('/admin-api/v1.0/currencies/', data)
      .then(res => res.data)
      .catch(this.handleError);
  };
}

export default CurrencyService;