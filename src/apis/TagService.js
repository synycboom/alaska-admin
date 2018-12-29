import BaseService from './BaseService';

class TagService extends BaseService {
  listTags = (currentPage, pageSize) => {
    return this.client.get('/admin-api/v1.0/tags/', { 
      params: { page: currentPage, page_size: pageSize }
    })
      .then(res => res.data)
      .catch(this.handleError);
  };

  getTag = (id) => {
    return this.client.get(`/admin-api/v1.0/tags/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  updateTag = (id, data) => {
    return this.client.put(`/admin-api/v1.0/tags/${id}/`, data)
      .then(res => res.data)
      .catch(this.handleError);
  };

  deleteTag = (id) => {
    return this.client.delete(`/admin-api/v1.0/tags/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  createTag = (data) => {
    return this.client.post('/admin-api/v1.0/tags/', data)
      .then(res => res.data)
      .catch(this.handleError);
  };
}

export default TagService;