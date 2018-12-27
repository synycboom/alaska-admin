import BaseService from './BaseService';

class LevelService extends BaseService {
  listLevels = (currentPage, pageSize) => {
    return this.client.get('/admin-api/v1.0/levels/', { 
      params: { page: currentPage, page_size: pageSize }
    })
      .then(res => res.data)
      .catch(this.handleError);
  };

  getLevel = (id) => {
    return this.client.get(`/admin-api/v1.0/levels/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  updateLevel = (id, data) => {
    return this.client.put(`/admin-api/v1.0/levels/${id}/`, data)
      .then(res => res.data)
      .catch(this.handleError);
  };

  deleteLevel = (id) => {
    return this.client.delete(`/admin-api/v1.0/levels/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  createLevel = (data) => {
    return this.client.post('/admin-api/v1.0/levels/', data)
      .then(res => res.data)
      .catch(this.handleError);
  };
}

export default LevelService;