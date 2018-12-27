import BaseService from './BaseService';

class SubCategoryService extends BaseService {
  listSubCategories = (currentPage, pageSize) => {
    return this.client.get('/admin-api/v1.0/sub-categories/', { 
      params: { page: currentPage, page_size: pageSize }
    })
      .then(res => res.data)
      .catch(this.handleError);
  };

  listParentCategories = () => {
    return this.client.get(`/admin-api/v1.0/sub-categories/parents/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  getSubCategory = (id) => {
    return this.client.get(`/admin-api/v1.0/sub-categories/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  updateSubCategory = (id, data) => {
    return this.client.put(`/admin-api/v1.0/sub-categories/${id}/`, data)
      .then(res => res.data)
      .catch(this.handleError);
  };

  deleteSubCategory = (id) => {
    return this.client.delete(`/admin-api/v1.0/sub-categories/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  createSubCategory = (data) => {
    return this.client.post('/admin-api/v1.0/sub-categories/', data)
      .then(res => res.data)
      .catch(this.handleError);
  };
}

export default SubCategoryService;