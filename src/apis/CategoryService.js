import BaseService from './BaseService';

class CategoryService extends BaseService {
  listCategories = (currentPage, pageSize) => {
    return this.client.get('/admin-api/v1.0/categories/', { 
      params: { page: currentPage, page_size: pageSize }
    })
      .then(res => res.data)
      .catch(this.handleError);
  };

  listAllCategories = () => {
    return this.client.get('/admin-api/v1.0/categories/all/')
      .then(res => res.data)
      .catch(this.handleError);
  };

  listSubCategories = (id) => {
    return this.client.get(`/admin-api/v1.0/categories/${id}/subcategories/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  getCategory = (id) => {
    return this.client.get(`/admin-api/v1.0/categories/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  updateCategory = (id, data) => {
    return this.client.put(`/admin-api/v1.0/categories/${id}/`, data)
      .then(res => res.data)
      .catch(this.handleError);
  };

  deleteCategory = (id) => {
    return this.client.delete(`/admin-api/v1.0/categories/${id}/`)
      .then(res => res.data)
      .catch(this.handleError);
  };

  createCategory = (data) => {
    return this.client.post('/admin-api/v1.0/categories/', data)
      .then(res => res.data)
      .catch(this.handleError);
  };
}

export default CategoryService;