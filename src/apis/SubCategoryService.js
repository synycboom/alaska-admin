import BaseService from './BaseService';

class SubCategoryService extends BaseService {
  listSubCategories = (currentPage, pageSize) => {
    return this.client.get('/admin-api/v1.0/subcategories/', { 
      params: { page: currentPage, page_size: pageSize }
    })
      .then(res => res.data)
      .catch(this.handleError);
  };

  getSubCategory = (id) => {
    return this.client.get(`/admin-api/v1.0/subcategories/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  updateSubCategory = (id, data) => {
    return this.client.put(`/admin-api/v1.0/subcategories/${id}/`, data)
      .then(res => res.data)
      .catch(this.handleError);
  };

  deleteSubCategory = (id) => {
    return this.client.delete(`/admin-api/v1.0/subcategories/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  createSubCategory = (data) => {
    return this.client.post('/admin-api/v1.0/subcategories/', data)
      .then(res => res.data)
      .catch(this.handleError);
  };
}

export default SubCategoryService;